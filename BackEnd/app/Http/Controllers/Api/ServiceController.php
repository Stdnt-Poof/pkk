<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreServiceRequest;
use App\Http\Requests\UpdateServiceRequest;
use App\Http\Resources\ServiceResource;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class ServiceController extends Controller
{
    /**
     * The rate the IDR prices are normalized with for the budget filter.
     */
    private const USD_TO_IDR_RATE = 16000;

    /**
     * The budget ranges the browse filter supports, in USD terms.
     *
     * @var array<int, string>
     */
    private const BUDGET_RANGES = ['under100', '100-500', '500plus'];

    /**
     * List the services offered on the Hire page.
     *
     * Hidden services are moderated away from everyone but their owner,
     * who can ask for them explicitly with ?mine=1.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $user = $request->user();
        $query = Service::query()->with('user')->orderByDesc('id');

        if ($request->boolean('mine')) {
            $query->where('user_id', $user->id);
        } else {
            $this->applyBrowseFilters($query, $request);
        }

        $services = $query->take(200)->get();

        $budget = (string) $request->query('budget', 'all');

        if (in_array($budget, self::BUDGET_RANGES, true)) {
            $services = $services
                ->filter(fn (Service $service) => $this->matchesBudget($service, $budget))
                ->values();
        }

        return ServiceResource::collection($services);
    }

    /**
     * Show a single service (the DM header fetches it by id).
     */
    public function show(Request $request, Service $service): ServiceResource
    {
        abort_unless(
            $service->status === 'published' || $service->user_id === $request->user()->id,
            Response::HTTP_NOT_FOUND
        );

        return new ServiceResource($service->load('user'));
    }

    /**
     * Publish a new service offering.
     */
    public function store(StoreServiceRequest $request): JsonResponse
    {
        $service = $request->user()->services()->make($request->serviceData());

        $service->save();

        return (new ServiceResource($service->load('user')))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Edit one of the current account's services.
     */
    public function update(UpdateServiceRequest $request, Service $service): ServiceResource
    {
        abort_unless($service->user_id === $request->user()->id, Response::HTTP_FORBIDDEN);

        $service->update($request->serviceData());

        return new ServiceResource($service->load('user'));
    }

    /**
     * Remove one of the current account's services.
     */
    public function destroy(Request $request, Service $service): Response
    {
        abort_unless($service->user_id === $request->user()->id, Response::HTTP_FORBIDDEN);

        $service->delete();

        return response()->noContent();
    }

    /**
     * List every service for the moderation table.
     */
    public function adminIndex(Request $request): AnonymousResourceCollection
    {
        $query = Service::query()->with('user')->orderByDesc('id');

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        return ServiceResource::collection($query->take(200)->get());
    }

    /**
     * Hide or republish a service.
     */
    public function adminStatus(Request $request, Service $service): ServiceResource
    {
        $validated = $request->validate(['status' => ['required', 'in:'.implode(',', Service::STATUSES)]]);

        $service->update(['status' => $validated['status']]);

        return new ServiceResource($service->load('user'));
    }

    /**
     * Delete a service as an administrator.
     */
    public function adminDestroy(Service $service): Response
    {
        $service->delete();

        return response()->noContent();
    }

    /**
     * Apply the search / tag / currency filters a member picked.
     */
    private function applyBrowseFilters($query, Request $request): void
    {
        $query->where('status', 'published');

        $search = trim((string) $request->query('search'));

        if ($search !== '') {
            $like = '%'.addcslashes($search, '%_\\').'%';

            $query->where(function ($builder) use ($like) {
                $builder->where('title', 'LIKE', $like)
                    ->orWhere('description', 'LIKE', $like)
                    ->orWhere('tags', 'LIKE', $like)
                    ->orWhereHas('user', fn ($user) => $user->where('username', 'LIKE', $like));
            });
        }

        $tag = trim((string) $request->query('tag'));

        if ($tag !== '') {
            $query->where('tags', 'LIKE', '%'.addcslashes($tag, '%_\\').'%');
        }

        $currency = (string) $request->query('currency', '');

        if ($currency !== '' && in_array($currency, StoreServiceRequest::CURRENCIES, true)) {
            $query->where('currency', $currency);
        }
    }

    /**
     * Check a service against a USD-normalized budget range.
     */
    private function matchesBudget(Service $service, string $range): bool
    {
        $usd = $service->currency === 'IDR' ? $service->price / self::USD_TO_IDR_RATE : $service->price;

        return match ($range) {
            'under100' => $usd < 100,
            '100-500' => $usd >= 100 && $usd <= 500,
            '500plus' => $usd > 500,
            default => true,
        };
    }
}
