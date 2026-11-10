<?php

namespace App\Http\Requests\Auth;

use App\Models\User;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;

class LoginRequest extends FormRequest
{
    /**
     * Failed logins allowed per identifier before a short lockout.
     * Keyed by the identifier alone so rotating IPs cannot keep
     * guessing one account; successes never count (see below).
     */
    private const MAX_ATTEMPTS = 5;

    /**
     * Seconds a failed attempt keeps counting against the lockout.
     */
    private const DECAY_SECONDS = 60;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'identifier' => ['required', 'string'],
            'password' => ['required', 'string'],
        ];
    }

    /**
     * Resolve the account matching the credentials, or fail.
     *
     * Failed attempts are counted per lowercased identifier: five in a
     * row answer 429 with Retry-After for a minute, and any successful
     * login clears the counter — so only genuine guessing accumulates.
     */
    public function authenticate(): User
    {
        $throttleKey = Str::lower((string) $this->input('identifier'));

        if (RateLimiter::tooManyAttempts($throttleKey, self::MAX_ATTEMPTS)) {
            $seconds = RateLimiter::availableIn($throttleKey);

            throw new HttpResponseException(response()->json([
                'message' => __('auth.throttle', ['seconds' => $seconds]),
            ], 429, ['Retry-After' => $seconds]));
        }

        $user = $this->findUser();

        if (! $user || ! Hash::check((string) $this->input('password'), $user->password)) {
            RateLimiter::hit($throttleKey, self::DECAY_SECONDS);

            throw new AuthenticationException(__('auth.failed'));
        }

        RateLimiter::clear($throttleKey);

        return $user;
    }

    /**
     * Find an account whose username or email matches the identifier, ignoring case.
     */
    private function findUser(): ?User
    {
        $identifier = Str::lower((string) $this->input('identifier'));

        return User::query()
            ->whereRaw('LOWER(username) = ?', [$identifier])
            ->orWhereRaw('LOWER(email) = ?', [$identifier])
            ->first();
    }
}
