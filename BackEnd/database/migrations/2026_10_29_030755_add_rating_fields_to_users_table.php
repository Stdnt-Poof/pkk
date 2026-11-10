<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * The stars live on the users table as agreed: "ratings" holds the raw
     * per-rater votes (JSON map of rater id => stars, one shot per pair)
     * while "rating"/"rating_count" are the denormalized average and total
     * the profile and service cards read directly.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->decimal('rating', 3, 2)->nullable()->after('bio');
            $table->unsignedInteger('rating_count')->default(0)->after('rating');
            $table->json('ratings')->nullable()->after('rating_count');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['rating', 'rating_count', 'ratings']);
        });
    }
};
