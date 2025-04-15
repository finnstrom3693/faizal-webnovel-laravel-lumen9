<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\Users;
use Illuminate\Database\QueryException;
use Illuminate\Support\Carbon;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthUsersController extends Controller
{
    /**
     * Get the user guard to be used during authentication.
     *
     * @return \Illuminate\Contracts\Auth\Guard
     */
    protected function guard()
    {
        return Auth::guard('api'); // Using default 'api' guard for users
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:255|unique:users,username',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:6',
            'display_name' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = Users::create([
                'username' => $request->username,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'display_name' => $request->display_name ?? $request->username,
                'join_date' => Carbon::now(),
                'last_login' => Carbon::now(),
                'account_status' => 'active',
            ]);

            $token = $this->guard()->login($user);

            return response()->json([
                'success' => true,
                'message' => 'User registered successfully',
                'data' => [
                    'access_token' => $token,
                    'token_type' => 'bearer',
                    'expires_in' => $this->guard()->factory()->getTTL() * 60,
                    'user' => $user
                ]
            ], 201);
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
                    'message' => 'Invalid user credentials'
                ], 401);
            }

            $user = $this->guard()->user();
            $user->last_login = Carbon::now();
            $user->save();

            return $this->respondWithToken($token);
        } catch (JWTException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Could not create token'
            ], 500);
        }
    }

    public function me()
    {
        try {
            $user = $this->guard()->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not authenticated'
                ], 401);
            }

            return response()->json([
                'success' => true,
                'data' => $user
            ]);
        } catch (JWTException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to authenticate user'
            ], 401);
        }
    }

    public function logout()
    {
        try {
            $this->guard()->logout();
            return response()->json([
                'success' => true,
                'message' => 'Successfully logged out'
            ]);
        } catch (JWTException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to logout, please try again.'
            ], 500);
        }
    }

    public function refresh()
    {
        try {
            $token = $this->guard()->refresh();
            return $this->respondWithToken($token, 'User token refreshed successfully');
        } catch (JWTException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Token could not be refreshed',
                'error' => $e->getMessage()
            ], 401);
        }
    }

    protected function respondWithToken($token, $message = 'User authentication successful', $statusCode = 200)
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