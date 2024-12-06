<?php

namespace Everest\Models\Billing;

use Everest\Models\Model;

/**
 * @property int $id
 * @property string $name
 * @property int $user_id
 * @property string $description
 * @property float $total
 * @property string $status
 * @property int $product_id
 * @property bool $is_renewal
 * @property string $payment_intent_id
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class Order extends Model
{
    public const STATUS_FAILED = 'failed';
    public const STATUS_EXPIRED = 'expired';
    public const STATUS_PENDING = 'pending';
    public const STATUS_PROCESSED = 'processed';

    /**
     * The resource name for this model when it is transformed into an
     * API representation using fractal.
     */
    public const RESOURCE_NAME = 'order';

    /**
     * The table associated with the model.
     */
    protected $table = 'orders';

    /**
     * Fields that are mass assignable.
     */
    protected $fillable = [
        'name', 'user_id', 'description', 'payment_intent_id',
        'total', 'status', 'product_id', 'is_renewal',
    ];

    /**
     * Cast values to correct type.
     */
    protected $casts = [
        'user_id' => 'int',
        'total' => 'float',
        'product_id' => 'int',
        'is_renewal' => 'bool',
    ];

    public static array $validationRules = [
        'name' => 'string|required|min:3',
        'user_id' => 'required|exists:users,id',
        'description' => 'required|string|min:3',
        'total' => 'required|min:0',
        'status' => 'required|in:expired,pending,failed,processed',
        'product_id' => 'exists:products,id',
        'is_renewal' => 'nullable|bool',
        'payment_intent_id' => 'required|string|unique:orders,payment_intent_id',
    ];
}
