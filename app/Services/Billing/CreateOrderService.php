<?php

namespace Everest\Services\Billing;

use Everest\Models\User;
use Everest\Models\Billing\Order;
use Everest\Models\Billing\Product;

class CreateOrderService
{
    /**
     * Process the creation of an order.
     */
    public function create(string $intent, User $user, Product $product, ?string $status = Order::STATUS_EXPIRED, ?bool $renewal = false): Order
    {
        $order = new Order();

        $order->name = uuid_create();
        $order->payment_intent_id = $intent;
        $order->user_id = $user->id;
        $order->description = 'Order for ' . $product->name;
        $order->total = $product->price;
        $order->status = $status ?? Order::STATUS_EXPIRED;
        $order->product_id = $product->id;
        $order->is_renewal = $renewal ?? false;

        $order->saveOrFail();

        return $order;
    }
}
