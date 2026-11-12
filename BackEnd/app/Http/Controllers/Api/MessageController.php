<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SendMessageRequest;
use App\Http\Resources\MessageResource;
use App\Http\Resources\PublicUserResource;
use App\Models\Message;
use App\Models\Service;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    /**
     * List the current account's DM threads, newest activity first.
     *
     * Threads are derived from the message pair — the newest message of
     * each pair carries the preview, the unread count and the service the
     * chat was started from, so no conversation table is needed.
     */
    public function threads(Request $request): JsonResponse
    {
        $me = $request->user()->id;

        $messages = Message::query()
            ->with(['sender:id,username,avatar_path,rating,rating_count', 'recipient:id,username,avatar_path,rating,rating_count', 'service:id,title,user_id'])
            ->where(fn ($query) => $query->where('sender_id', $me)->orWhere('recipient_id', $me))
            ->orderByDesc('id')
            ->get();

        $threads = [];

        foreach ($messages as $message) {
            $otherId = $message->sender_id === $me ? $message->recipient_id : $message->sender_id;

            if (! isset($threads[$otherId])) {
                $threads[$otherId] = [
                    'user' => new PublicUserResource($message->sender_id === $me ? $message->recipient : $message->sender),
                    'last_message' => (new MessageResource($message))->resolve($request),
                    'unread' => 0,
                    'service' => null,
                ];
            }

            if ($message->recipient_id === $me && $message->read_at === null) {
                $threads[$otherId]['unread']++;
            }

            if ($threads[$otherId]['service'] === null && $message->service !== null) {
                $threads[$otherId]['service'] = [
                    'id' => $message->service->id,
                    'title' => $message->service->title,
                ];
            }
        }

        return response()->json(['data' => array_values($threads)]);
    }

    /**
     * Fetch (and poll) the messages exchanged with one member.
     *
     * Fetching also marks the received messages as read — the unread
     * badge exists purely to survive until the thread is opened.
     */
    public function show(Request $request): JsonResponse
    {
        $request->validate(['with' => ['required', 'integer', 'exists:users,id']]);

        $me = $request->user();
        $other = User::query()->findOrFail((int) $request->query('with'));

        Message::query()
            ->where('recipient_id', $me->id)
            ->where('sender_id', $other->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        $query = Message::query()
            ->with('service:id,title,user_id')
            ->where(fn ($builder) => $builder
                ->where('sender_id', $me->id)->where('recipient_id', $other->id)
                ->orWhere(fn ($pair) => $pair->where('sender_id', $other->id)->where('recipient_id', $me->id)))
            ->orderBy('id');

        if (is_numeric($request->query('after'))) {
            $query->where('id', '>', (int) $request->query('after'));
        }

        $messages = $query->take(500)->get();

        $service = $messages
            ->map(fn (Message $message) => $message->service)
            ->filter(fn (?Service $service) => $service !== null)
            ->last();

        return response()->json([
            'data' => [
                'user' => (new PublicUserResource($other))->resolve($request),
                'messages' => MessageResource::collection($messages)->resolve($request),
                'service' => $service === null ? null : ['id' => $service->id, 'title' => $service->title],
                'can_rate' => $this->canRate($me, $other),
                'my_rating' => ($other->ratings ?? [])[$me->id] ?? null,
                'their_rating' => ($me->ratings ?? [])[$other->id] ?? null,
            ],
        ]);
    }

    /**
     * Send a direct message.
     */
    public function store(SendMessageRequest $request): JsonResponse
    {
        $message = Message::create([
            'sender_id' => $request->user()->id,
            'recipient_id' => (int) $request->validated('recipient_id'),
            'service_id' => $request->validated('service_id'),
            'body' => $request->validated('body'),
        ]);

        return (new MessageResource($message))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Whether the current account may rate the other member.
     *
     * The hirer earns the right by having messaged the provider about one
     * of the provider's services; repeat ratings are allowed (each one
     * replaces the rater's previous vote).
     */
    private function canRate(User $me, User $other): bool
    {
        return Message::query()
            ->where('sender_id', $me->id)
            ->where('recipient_id', $other->id)
            ->whereHas('service', fn ($query) => $query->where('user_id', $other->id))
            ->exists();
    }
}
