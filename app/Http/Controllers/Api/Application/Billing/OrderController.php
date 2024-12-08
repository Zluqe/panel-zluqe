<?php

namespace Everest\Http\Controllers\Api\Application\Billing;

use Illuminate\Http\Request;
use Everest\Models\Billing\Order;
use Everest\Transformers\Api\Application\OrderTransformer;
use Everest\Http\Controllers\Api\Application\ApplicationApiController;

class OrderController extends ApplicationApiController
{
    /**
     * OrderController constructor.
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Get all orders.
     */
    public function index(Request $request): array
    {
        return $this->fractal->collection(Order::all())
            ->transformWith(OrderTransformer::class)
            ->toArray();
    }
}
