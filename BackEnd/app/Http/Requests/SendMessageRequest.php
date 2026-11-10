<?php

namespace App\Http\Requests;

use App\Models\Service;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class SendMessageRequest extends FormRequest
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
     * The optional service_id carries the Hire context: it must point at
     * a service offered by the very member being messaged.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'recipient_id' => ['required', 'integer', 'exists:users,id', $this->notSelfRule('recipient_id')],
            'body' => ['required', 'string', 'min:1', 'max:1000'],
            'service_id' => ['nullable', 'integer', 'exists:services,id', $this->recipientOwnsServiceRule()],
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
            'recipient_id' => 'recipient',
            'service_id' => 'service',
        ];
    }

    /**
     * Reject messages addressed to yourself.
     */
    private function notSelfRule(string $attribute): Closure
    {
        return function (string $attribute, mixed $value, Closure $fail): void {
            if ((int) $value === (int) $this->user()?->id) {
                $fail('You cannot message yourself.');
            }
        };
    }

    /**
     * Ensure the referenced service belongs to the recipient.
     */
    private function recipientOwnsServiceRule(): Closure
    {
        return function (string $attribute, mixed $value, Closure $fail): void {
            if (! is_numeric($value)) {
                return;
            }

            $service = Service::query()->find((int) $value);

            if ($service === null || $service->user_id !== (int) $this->input('recipient_id')) {
                $fail('The service is not offered by the member you are messaging.');
            }
        };
    }
}
