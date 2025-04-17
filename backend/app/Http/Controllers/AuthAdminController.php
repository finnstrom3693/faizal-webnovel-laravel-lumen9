<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\UserAdmin;
use App\Models\InviteCodes;
use Illuminate\Database\QueryException;
use Illuminate\Support\Carbon; 
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthAdminController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:admin', ['except' => ['login', 'register']]);
        auth()->shouldUse('admin'); // Force the admin guard globally
    }

    protected function guard()
    {
        return Auth::guard('admin');
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users_admin,email',
            'password' => 'required|string|min:6',
            'invite_code' => 'required|string|exists:invite_codes,code'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $inviteCode = InviteCodes::where('code', $request->invite_code)
                ->where('is_used', false)
                ->first();

            if (!$inviteCode) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid or already used invite code'
                ], 422);
            }

            $admin = UserAdmin::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            $inviteCode->update([
                'is_used' => true,
                'used_by' => $admin->id,
                'used_at' => Carbon::now(),
            ]);

            $token = $this->guard()->login($admin);

            return $this->respondWithToken($token, 'Admin registered successfully', 201);
        } catch (QueryException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Registration failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $credentials = $request->only('email', 'password');

        try {
            if (!$token = $this->guard()->attempt($credentials)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid admin credentials'
                ], 401);
            }

            $admin = $this->guard()->user();
            $admin->last_login = Carbon::now();
            $admin->save();

            return $this->respondWithToken($token);
        } catch (JWTException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Could not create token'
            ], 500);
        }
    }

    public function me(Request $request)
    {
        try {
            $admin = $this->guard()->user();

            if (!$admin) {
                return response()->json([
                    'success' => false,
                    'message' => 'Admin not authenticated'
                ], 401);
            }

            return response()->json([
                'success' => true,
                'data' => $admin
            ]);
        } catch (JWTException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to authenticate admin'
            ], 401);
        }
    }

    public function logout(Request $request)
    {
        try {
            $token = $request->bearerToken();
            if (!$token) {
                return response()->json([
                    'success' => false,
                    'message' => 'Token not provided'
                ], 401);
            }

            auth('admin')->setToken($token)->invalidate();

            return response()->json([
                'success' => true,
                'message' => 'Successfully logged out'
            ]);
        } catch (JWTException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to logout, please try again.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function refresh(Request $request)
    {
        try {
            $token = auth('admin')->setToken($request->bearerToken())->refresh();
            return $this->respondWithToken($token, 'Admin token refreshed successfully');
        } catch (JWTException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Token could not be refreshed',
                'error' => $e->getMessage()
            ], 401);
        }
    }

    protected function respondWithToken($token, $message = 'Admin authentication successful', $statusCode = 200)
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => [
                'access_token' => $token,
                'token_type' => 'bearer',
                'expires_in' => $this->guard()->factory()->getTTL() * 60,
                'user' => $this->guard()->user()
            ]
        ], $statusCode);
    }
}
