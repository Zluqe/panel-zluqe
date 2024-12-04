<?php

namespace Everest\Http\Controllers\Api\Client\Billing;

use Everest\Models\Node;
use Stripe\StripeClient;
use Illuminate\Http\Request;
use Laravel\Cashier\Cashier;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;
use Everest\Models\Billing\Product;
use Illuminate\Http\RedirectResponse;
use Everest\Services\Billing\CreateServerService;
use Everest\Http\Controllers\Api\Client\ClientApiController;
use Everest\Repositories\Wings\DaemonConfigurationRepository;
use Everest\Exceptions\Http\Connection\DaemonConnectionException;

class OrderController extends ClientApiController
{
    public function __construct(
        private CreateServerService $serverCreation,
        private DaemonConfigurationRepository $repository,
    ) {
        parent::__construct();

        $this->stripe = new StripeClient(env('STRIPE_SECRET'));

    }

    /**
     * Create a Stripe payment intent.
     */
    public function intent(Request $request, int $id): JsonResponse
    {
        $product = Product::findOrFail($id);

        $paymentIntent = $this->stripe->paymentIntents->create([
            'amount' => $product->price * 100,
            'currency' => 'usd',
            'payment_method_types' => [
                'card',
                'paypal',
                'link',
            ],
        ]);

        return response()->json([
            'id' => $paymentIntent->id,
            'secret' => $paymentIntent->client_secret,
        ]);
    }

    /**
     * Update a Payment Intent with new data from the UI.
     */
    public function updateIntent(Request $request, int $id): Response
    {
        $intent = $this->stripe->paymentIntents->retrieve($request->input('intent'));

        $intent->metadata = [
            'customer_email' => $request->user()->email,
            'customer_name' => $request->user()->username,
            'product_id' => $id,
            'variables' => $request->input('variables'),
            'node_id' => $request->input('node_id'),
        ];

        $intent->save();

        return $this->returnNoContent();
    }

    /**
     * Process a successful subscription purchase.
     */
    public function process(Request $request): Response
    {
        $intent = $this->stripe->paymentIntents->retrieve($request->input('intent'));

        if (!$intent) {
            throw new \Exception('Unable to fetch payment intent from Stripe.');
        }

        $product = Product::findOrFail($intent->metadata->product_id);

        $server = $this->serverCreation->process($request, $product, $intent->metadata);

        return $this->returnNoContent();
    }
}
