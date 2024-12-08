<?php

namespace Everest\Http\Controllers\Api\Client\Billing;

use Stripe\StripeClient;
use Everest\Models\Server;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Everest\Models\Billing\Order;
use Illuminate\Http\JsonResponse;
use Everest\Models\Billing\Product;
use Everest\Exceptions\DisplayException;
use Everest\Services\Billing\CreateOrderService;
use Everest\Services\Billing\CreateServerService;
use Everest\Http\Controllers\Api\Client\ClientApiController;
use Everest\Repositories\Wings\DaemonConfigurationRepository;

class StripeController extends ClientApiController
{
    public function __construct(
        private CreateOrderService $orderService,
        private CreateServerService $serverCreation,
        private DaemonConfigurationRepository $repository,
    ) {
        parent::__construct();

        $this->stripe = new StripeClient(env('STRIPE_SECRET'));
    }

    /**
     * Send the Stripe public key to the frontend.
     */
    public function publicKey(Request $request, int $id): JsonResponse
    {
        return response()->json([
            'key' => env('STRIPE_KEY'),
        ]);
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

        $this->orderService->create(
            $paymentIntent->id,
            $request->user(),
            $product,
            Order::STATUS_PENDING,
            boolval($request->input('renewal') ?? false),
        );

        return response()->json([
            'id' => $paymentIntent->id,
            'secret' => $paymentIntent->client_secret,
        ]);
    }

    /**
     * Update a Payment Intent with new data from the UI.
     */
    public function updateIntent(Request $request, ?int $id = null): Response
    {
        $intent = $this->stripe->paymentIntents->retrieve($request->input('intent'));

        $intent->metadata = [
            'customer_email' => $request->user()->email,
            'customer_name' => $request->user()->username,
            'product_id' => $id,
            'variables' => $request->input('variables') ?? [],
            'node_id' => $request->input('node_id') ?? null,
            'server_id' => $request->input('server_id') ?? 0,
        ];

        $intent->save();

        return $this->returnNoContent();
    }

    /**
     * Process a successful subscription purchase.
     */
    public function process(Request $request): Response
    {
        // Hate doing this, but gives Stripe's API time to catch up
        // and process the payment.
        sleep(2);

        $order = Order::where('user_id', $request->user()->id)->latest()->first();
        $intent = $this->stripe->paymentIntents->retrieve($request->input('intent'));

        if (!$intent) {
            throw new DisplayException('Unable to fetch payment intent from Stripe.');
        }

        if (
            $order->status === Order::STATUS_PROCESSED
            && $intent->id === $order->payment_intent_id
        ) {
            throw new DisplayException('This order has already been processed.');
        };
        
        if ($intent->status !== 'succeeded') {
            $order->update(['status' => Order::STATUS_FAILED]);
            throw new DisplayException('The order has been canceled.');
        }

        if ($order->is_renewal && ((int) $intent->metadata->server_id != 0)) {
            $server = Server::findOrFail((int) $intent->metadata->server_id);

            $server->update([
                'days_until_renewal' => $server->days_until_renewal + 30,
                'status' => $server->isSuspended() ? null : $server->status,
            ]);
        } else {
            $product = Product::findOrFail($intent->metadata->product_id);

            $this->serverCreation->process($request, $product, $intent->metadata, $order);
        }
    
        $order->update([
            'status' => Order::STATUS_PROCESSED
        ]);

        return $this->returnNoContent();
    }
}
