<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\PortfolioController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\RatingController;
use App\Http\Controllers\Api\ServiceController;
use Illuminate\Support\Facades\Route;

Route::post('/auth/register', [AuthController::class, 'register'])->middleware('throttle:10,1');
Route::post('/auth/login', [AuthController::class, 'login'])->middleware('throttle:10,1');

// Preview photos back the portfolio cards, so they are readable without a
// token — the uploaded files themselves stay behind auth.
Route::get('/portfolios/{portfolio}/preview', [PortfolioController::class, 'preview'])->whereNumber('portfolio')->name('portfolios.preview');

// Profile media is public by design: <img> and <video> cannot carry a
// bearer token, and profile pictures are not private data.
Route::get('/users/{user}/avatar', [ProfileController::class, 'avatar'])->whereNumber('user')->name('users.avatar');
Route::get('/users/{user}/cover', [ProfileController::class, 'cover'])->whereNumber('user')->name('users.cover');

// Post pictures follow the same rule — the feed renders them in <img>.
Route::get('/posts/{post}/images/{image}', [PostController::class, 'image'])->whereNumber('post')->whereNumber('image')->name('posts.image');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::get('/users/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/auth/password', [AuthController::class, 'changePassword'])->middleware('throttle:10,1');

    // Own-account settings live in the user's JSON column; a partial
    // PATCH merges only the keys it carries. Deleting the account
    // cascades every row that hangs off the users table.
    Route::patch('/users/me/settings', [AuthController::class, 'updateSettings'])->middleware('throttle:60,1');
    Route::delete('/users/me', [AuthController::class, 'destroy']);

    // Profile updates are multipart (file uploads), and PHP only parses a
    // multipart body for POST requests — hence POST, not PATCH.
    Route::post('/profile', [ProfileController::class, 'update'])->middleware('throttle:30,1');

    Route::get('/portfolios', [PortfolioController::class, 'index']);
    Route::post('/portfolios', [PortfolioController::class, 'store'])->middleware('throttle:20,1');
    Route::get('/portfolios/{portfolio}/file', [PortfolioController::class, 'file'])->whereNumber('portfolio')->name('portfolios.file');

    // Home search: other members only, and the profile page they open.
    Route::get('/users/search', [ProfileController::class, 'search']);
    Route::get('/profile/{username}', [ProfileController::class, 'profile']);

    // Hire: the public card of any member (DM headers open chats that
    // have no messages yet, so they cannot be derived from the pair).
    // Registered after /users/search so the literal path wins.
    Route::get('/users/{user}', [ProfileController::class, 'show'])->whereNumber('user');

    // Home: reporting a member uses the same overlay as flagging a post.
    Route::post('/users/{user}/report', [ProfileController::class, 'report'])->whereNumber('user')->middleware('throttle:10,1');

    // Home: follow/unfollow a member — one row per follower pair, so the
    // call toggles like the post like/save endpoints.
    Route::post('/users/{user}/follow', [ProfileController::class, 'toggleFollow'])->whereNumber('user')->middleware('throttle:30,1');

    // The followers/following lists behind the profile stats.
    Route::get('/users/{user}/followers', [ProfileController::class, 'followers'])->whereNumber('user');
    Route::get('/users/{user}/following', [ProfileController::class, 'following'])->whereNumber('user');

    // Hire: service listings.
    Route::get('/services', [ServiceController::class, 'index']);
    Route::get('/services/{service}', [ServiceController::class, 'show'])->whereNumber('service');
    Route::post('/services', [ServiceController::class, 'store'])->middleware('throttle:10,1');
    Route::patch('/services/{service}', [ServiceController::class, 'update'])->whereNumber('service');
    Route::delete('/services/{service}', [ServiceController::class, 'destroy'])->whereNumber('service');

    // Hire: direct messages — threads are derived from the message pair.
    Route::get('/threads', [MessageController::class, 'threads']);
    Route::get('/messages', [MessageController::class, 'show']);
    Route::post('/messages', [MessageController::class, 'store'])->middleware('throttle:60,1');

    // Hire: a hirer rates the provider after a service DM — repeat
    // ratings replace the rater's previous vote.
    Route::post('/ratings', [RatingController::class, 'store'])->middleware('throttle:20,1');

    // Home feed: every member's posts, newest first.
    // `?user={username}` scopes the same feed to one profile tab.
    Route::get('/posts', [PostController::class, 'index']);
    Route::post('/posts', [PostController::class, 'store'])->middleware('throttle:20,1');
    Route::post('/posts/{post}/like', [PostController::class, 'toggleLike'])->whereNumber('post')->middleware('throttle:60,1');
    Route::post('/posts/{post}/save', [PostController::class, 'toggleSave'])->whereNumber('post')->middleware('throttle:60,1');
    Route::post('/posts/{post}/report', [PostController::class, 'report'])->whereNumber('post')->middleware('throttle:10,1');
    Route::post('/posts/{post}/comments', [PostController::class, 'storeComment'])->whereNumber('post')->middleware('throttle:60,1');
    Route::post('/comments/{comment}/like', [PostController::class, 'toggleCommentLike'])->whereNumber('comment')->middleware('throttle:60,1');

    // The author deletes their own post; admins delete anyone's (the
    // admin dashboard keeps its own /admin/posts route).
    Route::delete('/posts/{post}', [PostController::class, 'destroy'])->whereNumber('post');
});

Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/overview', [AdminController::class, 'overview']);

    // The overview's member list and the flag queue it links into.
    Route::get('/users', [AdminController::class, 'users']);
    Route::patch('/users/{user}', [AdminController::class, 'updateRole'])->whereNumber('user');
    Route::get('/reports', [AdminController::class, 'reports']);
    Route::delete('/reports/{report}', [AdminController::class, 'dismiss'])->whereNumber('report');
    Route::delete('/posts/{post}', [AdminController::class, 'destroyPost'])->whereNumber('post');

    // Hire: service moderation.
    Route::get('/services', [ServiceController::class, 'adminIndex']);
    Route::patch('/services/{service}', [ServiceController::class, 'adminStatus'])->whereNumber('service');
    Route::delete('/services/{service}', [ServiceController::class, 'adminDestroy'])->whereNumber('service');
});
