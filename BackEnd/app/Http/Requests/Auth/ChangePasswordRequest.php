<?php

namespace App\Http\Requests\Auth;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ChangePasswordRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'current' => ['required', 'string', 'current_password'],
            'next' => ['required', 'string', 'min:8'],
            'confirm' => ['required', 'same:next'],
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
            'current' => 'current password',
            'next' => 'new password',
            'confirm' => 'confirm new password',
        ];
    }
}
