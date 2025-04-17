<?php

namespace App\Http\Middleware;

use Closure;
use Exception;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Http\Middleware\BaseMiddleware;

class AdminAuthMiddleware extends BaseMiddleware
{
    public function handle($request, Closure $next)
    {
        try {
            auth('admin')->authenticate();
        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => 'Unauthorized admin'], 401);
        }

        return $next($request);
    }
}
