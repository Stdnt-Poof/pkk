<?php

namespace App\Http\Controllers\Api;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Resources\ReportResource;
use App\Http\Resources\UserResource;
use App\Models\Post;
use App\Models\Report;
use App\Models\Service;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class AdminController extends Controller
{
    /**
     * The window the "active users" card measures over.
     */
    private const ACTIVE_WINDOW_DAYS = 7;

    /**
     * The tables whose rows count as a member being active that day.
     *
     * @var array<int, array{table: string, user_column: string}>
     */
    private const ACTIVITY_SOURCES = [
        ['table' => 'posts', 'user_column' => 'user_id'],
        ['table' => 'comments', 'user_column' => 'user_id'],
        ['table' => 'messages', 'user_column' => 'sender_id'],
        ['table' => 'services', 'user_column' => 'user_id'],
    ];

    /**
     * Return the account totals that the admin dashboard is built on.
     */
    public function overview(): JsonResponse
    {
        return response()->json([
            'data' => [
                'total_users' => User::query()->count(),
                'admins' => User::query()->where('role', UserRole::Admin)->count(),
                'members' => User::query()->where('role', UserRole::User)->count(),
                'total_posts' => Post::query()->count(),
                'total_services' => Service::query()->count(),
                'flagged_posts' => Post::query()->whereHas('reports')->count(),
                'open_reports' => Report::query()->count(),
                'active_users_7d' => $this->activeUsers(),
            ],
        ]);
    }

    /**
     * Every account, for the overview's member list.
     *
     * Rows link out to /Profile/:username — the dashboard browses people
     * through the same profile page members do. Each row also carries its
     * moderation heat: direct flags plus flags on the member's posts.
     */
    public function users(): AnonymousResourceCollection
    {
        return UserResource::collection(
            User::query()
                ->withCount([
                    'posts',
                    'reportsReceived as direct_reports_count',
                    'reportsOnPosts as post_reports_count',
                ])
                ->orderBy('id')
                ->get()
        );
    }

    /**
     * Change one member's role — the overview's "Make admin" action.
     *
     * Roles are assigned explicitly (the column is deliberately outside
     * fillable so no mass-assignment path can ever promote an account),
     * and nobody may change their own role: the last administrator can
     * never lock the dashboard from behind their own row.
     */
    public function updateRole(Request $request, User $user): UserResource
    {
        $validated = $request->validate([
            'role' => ['required', 'string', Rule::enum(UserRole::class)],
        ]);

        abort_if($user->id === $request->user()->id, 422, 'You cannot change your own role.');

        $user->role = UserRole::from($validated['role']);
        $user->save();

        $user->loadCount([
            'posts',
            'reportsReceived as direct_reports_count',
            'reportsOnPosts as post_reports_count',
        ]);

        return new UserResource($user);
    }

    /**
     * The flag queue: one row per live flag, newest first.
     *
     * A post flagged by three people shows as three rows — each flag is
     * dismissible on its own, and removing the post clears them all.
     * Flags aimed at members sit in the same queue.
     */
    public function reports(): AnonymousResourceCollection
    {
        return ReportResource::collection(
            Report::query()
                ->with([
                    'post.user:id,username,avatar_path,rating,rating_count',
                    'reportedUser:id,username,avatar_path,rating,rating_count',
                    'reporter:id,username,avatar_path,rating,rating_count',
                ])
                ->orderByDesc('id')
                ->take(200)
                ->get()
        );
    }

    /**
     * Dismiss one flag. The row disappears; the post stays. Because the
     * pair is unique, the reporter may flag it again if they disagree.
     */
    public function dismiss(Report $report): Response
    {
        $report->delete();

        return response()->noContent();
    }

    /**
     * Remove a flagged post outright — comments and flags cascade away
     * with it.
     */
    public function destroyPost(Post $post): Response
    {
        $post->delete();

        return response()->noContent();
    }

    /**
     * Count distinct members who created content in the past 7 days.
     *
     * Activity is derived from the existing tables (posts, comments,
     * messages, services) so the number is rebuildable from history —
     * no login-tracking table required. Each source is a plain pluck so
     * the query behaves identically on MySQL and SQLite.
     */
    private function activeUsers(): int
    {
        $since = now()->subDays(self::ACTIVE_WINDOW_DAYS);

        return collect(self::ACTIVITY_SOURCES)
            ->flatMap(fn (array $source) => DB::table($source['table'])
                ->where('created_at', '>=', $since)
                ->pluck($source['user_column']))
            ->unique()
            ->count();
    }
}
