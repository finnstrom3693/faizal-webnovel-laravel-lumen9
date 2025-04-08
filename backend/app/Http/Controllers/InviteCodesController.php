<?php

namespace App\Http\Controllers;

use App\Models\InviteCodes;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Carbon\Carbon;

class InviteCodesController extends Controller
{
    // Get all invite codes
    public function index()
    {
        return response()->json(InviteCodes::all());
    }

    // Generate a new invite code
    public function store(Request $request)
    {
        $code = Str::upper(Str::random(10)); // Generate 10-character uppercase code

        $invite = InviteCodes::create([
            'code' => $code,
            'is_used' => false,
        ]);

        return response()->json($invite, 201);
    }

    // Check if a code is valid (not used)
    public function validateCode($code)
    {
        $invite = InviteCodes::where('code', $code)->first();

        if (!$invite) {
            return response()->json(['message' => 'Code not found'], 404);
        }

        if ($invite->is_used) {
            return response()->json(['message' => 'Code has already been used'], 400);
        }

        return response()->json(['message' => 'Code is valid']);
    }

    // Mark an invite code as used
    public function useCode($code)
    {
        $invite = InviteCodes::where('code', $code)->first();

        if (!$invite) {
            return response()->json(['message' => 'Code not found'], 404);
        }

        if ($invite->is_used) {
            return response()->json(['message' => 'Code has already been used'], 400);
        }

        $invite->update([
            'is_used' => true,
            'used_at' => Carbon::now(),
        ]);

        return response()->json(['message' => 'Code used successfully']);
    }
}
