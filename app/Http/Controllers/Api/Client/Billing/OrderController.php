<?php

namespace Everest\Http\Controllers\Api\Client\Billing;

use Illuminate\Http\Request;
use Everest\Models\Billing\Order;
use Everest\Transformers\Api\Client\OrderTransformer;
use Everest\Http\Controllers\Api\Client\ClientApiController;

class OrderController extends ClientApiController
{
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * View all of the orders made on a users' account.
     */
    public function index(Request $request): array
    {
        $orders = Order::where('user_id', $request->user()->id)->latest()->get();

        return $this->fractal->collection($orders)
            ->transformWith(OrderTransformer::class)
            ->toArray();
    }
}
