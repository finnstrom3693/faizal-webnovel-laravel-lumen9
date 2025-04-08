<?php

return [
    'defaults' => [
        'guard' => 'api',
        'passwords' => 'users_admin',
    ],

    'guards' => [
        'web' => [
            'driver' => 'session',
            'provider' => 'users_admin',
        ],

        'api' => [
            'driver' => 'jwt',
            'provider' => 'users_admin',
        ],
    ],

    'providers' => [
        'users_admin' => [
            'driver' => 'eloquent',
            'model' => App\Models\UserAdmin::class,
        ],
    ],

    'passwords' => [
        'users_admin' => [
            'provider' => 'users_admin',
            'table' => 'password_resets',
            'expire' => 60,
            'throttle' => 60,
        ],
    ],
];