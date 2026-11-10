<?php

namespace App\Http\Requests;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreRatingRequest extends FormRequest
{
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
     * Eligibility (a service DM thread must exist) and the one-shot rule
     * live in the controller — they need the message and rating state.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'recipient_id' => ['required', 'integer', 'exists:users,id', $this->notSelfRule()],
            'stars' => ['required', 'integer', 'min:1', 'max:5'],
        ];
    }

    /**
     * Get the attributes to use when validating.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'recipient_id' => 'member',
            'stars' => 'rating',
        ];
    }

    /**
     * Reject ratings addressed to yourself.
     */
    private function notSelfRule(): Closure
    {
        return function (string $attribute, mixed $value, Closure $fail): void {
            if ((int) $value === (int) $this->user()?->id) {
                $fail('You cannot rate yourself.');
            }
        };
    }
}
