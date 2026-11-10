<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ChangePasswordRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Laravel\Sanctum\PersonalAccessToken;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
    /**
     * Create a new account and issue an API token for it.
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create($request->credentials());

        return $this->tokenResponse($user, 201);
    }

    /**
     * Issue an API token for an existing account.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        return $this->tokenResponse($request->authenticate());
    }

    /**
     * Revoke the token used to make the request.
     */
    public function logout(Request $request): JsonResponse
    {
        $token = $request->user()->currentAccessToken();

        if ($token instanceof PersonalAccessToken) {
            $token->delete();
        }

        return response()->json([
            'message' => 'You have been logged out.',
        ]);
    }

    /**
     * Return the account belonging to the current token.
     */
    public function me(Request $request): UserResource
    {
        return new UserResource($request->user());
    }

    /**
     * Replace the current account password.
     *
     * Every other token is revoked with it: a stolen token must not
     * survive the rotation, while the token used to make this request
     * keeps the caller signed in on the device they are holding.
     */
    public function changePassword(ChangePasswordRequest $request): JsonResponse
    {
        $user = $request->user();

        $user->update([
            'password' => $request->validated('next'),
        ]);

        $current = $user->currentAccessToken();

        $query = $user->tokens();

        if ($current instanceof PersonalAccessToken) {
            $query->whereKeyNot($current->id);
        }

        $query->delete();

        return response()->json([
            'message' => 'Your password has been updated.',
        ]);
    }

    /**
     * Merge the caller's own settings — a partial body updates only the
     * keys it carries, and the column stays out of fillable so no other
     * endpoint can write it.
     */
    public function updateSettings(Request $request): UserResource
    {
        $validated = $request->validate([
            'profile_visibility' => ['sometimes', Rule::in(['everyone', 'followers', 'onlyyou'])],
            'posts_visibility' => ['sometimes', Rule::in(['everyone', 'followers', 'onlyyou'])],
            'chat_requests' => ['sometimes', 'boolean'],
            'chat_receipts' => ['sometimes', 'boolean'],
            'mute_all' => ['sometimes', 'boolean'],
            'mute_duration' => ['sometimes', Rule::in(['1', '12', '24', '168'])],
            'notif_types' => ['sometimes', 'array'],
            'notif_types.*' => ['boolean'],
            'reduce_motion' => ['sometimes', 'boolean'],
            'language' => ['sometimes', Rule::in(['en', 'id'])],
        ]);

        $user = $request->user();
        $user->settings = array_merge($user->settings ?? [], $validated);
        $user->save();

        return new UserResource($user);
    }

    /**
     * Delete the caller's account. Sanctum tokens are morphs with no FK,
     * so they go explicitly; every other row cascades from the users row.
     */
    public function destroy(Request $request): Response
    {
        $user = $request->user();

        DB::transaction(function () use ($user) {
            $user->tokens()->delete();
            $user->delete();
        });

        return response()->noContent();
    }

    /**
     * Build the response shared by registration and login.
     */
    private function tokenResponse(User $user, int $status = 200): JsonResponse
    {
        return response()->json([
            'data' => [
                'user' => new UserResource($user),
                'token' => $user->createToken('auth')->plainTextToken,
            ],
        ], $status);
    }
}
