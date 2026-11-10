<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRatingRequest;
use App\Http\Resources\PublicUserResource;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class RatingController extends Controller
{
    /**
     * Let a hirer rate the provider they messaged about a service.
     *
     * One shot per pair: the raw vote lands in the provider's JSON map,
     * and the denormalized average the profile and service cards read
     * is recomputed from it.
     */
    public function store(StoreRatingRequest $request): JsonResponse
    {
        $rater = $request->user();
        $provider = User::query()->findOrFail((int) $request->validated('recipient_id'));

        $this->authorizeServiceThread($rater, $provider);

        $votes = $provider->ratings ?? [];
        $key = (string) $rater->id;

        if (array_key_exists($key, $votes)) {
            abort(Response::HTTP_UNPROCESSABLE_ENTITY, 'You have already rated this member.');
        }

        $votes[$key] = (int) $request->validated('stars');

        $provider->ratings = $votes;
        $provider->recalculateRating();
        $provider->save();

        return (new PublicUserResource($provider))->response();
    }

    /**
     * Only members the rater DMed about their own service may be rated.
     */
    private function authorizeServiceThread(User $rater, User $provider): void
    {
        $sharedService = Message::query()
            ->where('sender_id', $rater->id)
            ->where('recipient_id', $provider->id)
            ->whereHas('service', fn ($query) => $query->where('user_id', $provider->id))
            ->exists();

        abort_unless($sharedService, Response::HTTP_UNPROCESSABLE_ENTITY, 'You can only rate a member after messaging them about their service.');
    }
}
