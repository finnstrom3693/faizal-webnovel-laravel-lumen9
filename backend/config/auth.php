<?php

return [
    'defaults' => [
        'guard' => 'api',
        'passwords' => 'users',
    ],

    'guards' => [
        'api' => [
            'driver' => 'jwt',
            'provider' => 'users',
        ],
        
        'admin' => [
            'driver' => 'jwt',
            'provider' => 'users_admin',
        ],
    ],

    'providers' => [
        'users' => [
            'driver' => 'eloquent',
            'model' => App\Models\Users::class,
        ],
        
        'users_admin' => [
            'driver' => 'eloquent',
            'model' => App\Models\UserAdmin::class,
        ],
    ],

    'passwords' => [
        'users' => [
            'provider' => 'users',
            'table' => 'password_resets',
            'expire' => 60,
        ],
        
        'users_admin' => [
            'provider' => 'users_admin',
            'table' => 'admin_password_resets',
            'expire' => 60,
        ],
    ],
];