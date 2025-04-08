<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InviteCodes extends Model
{
    // Table name (optional if it matches the plural of the class name)
    protected $table = 'invite_codes';

    // Fields that can be mass assigned
    protected $fillable = [
        'code',
        'is_used',
        'used_at',
    ];

    // Casts for specific fields
    protected $casts = [
        'is_used' => 'boolean',
        'used_at' => 'datetime',
    ];
}
