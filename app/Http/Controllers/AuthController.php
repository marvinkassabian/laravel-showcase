<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function getOrCreateUser(Request $request)
    {
        // Generate a unique device identifier if not provided
        $deviceId = $request->header('X-Device-Id') ?? $request->ip() . '_' . $request->userAgent();
        
        // Find or create user based on device identifier
        $user = User::firstOrCreate(
            ['email' => 'guest_' . md5($deviceId) . '@laravel-showcase.app'],
            [
                'name' => 'Guest User',
                'password' => Hash::make(uniqid()),
            ]
        );

        // Create token
        $token = $user->createToken('guest-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
            ],
        ]);
    }
}
