<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Tymon\JWTAuth\Contracts\JWTSubject;

class UserAdmin extends Model implements AuthenticatableContract, JWTSubject
{
    use Authenticatable;

    protected $table = 'users_admin';

    protected $fillable = [
        'name', 'role', 'email', 'password',
    ];

    protected $hidden = [
        'password',
    ];

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return ['role' => 'users_admin'];
    }
}
