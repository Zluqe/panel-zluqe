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
];
