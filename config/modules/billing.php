<?php

return [
    /*
     * Enable or disable the biling module.
     */
    'enabled' => env('BILLING_ENABLED', false),

    /*
     * Choose whether to add PayPal integration to the Panel.
     */
    'paypal' => env('BILLING_PAYPAL', false),

    /*
     * Choose whether to add Link integration to the Panel.
     */
    'link' => env('BILLING_LINK', false),

    /*
     * Set a currency code and symbol to use for billing.
     */
    'currency' => [
        'symbol' => '$',
        'code' => 'usd',
    ],
];
