<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * A report now points at either a post or a member — never both.
     * post_id becomes nullable so member flags can live in the same table,
     * and each target type keeps its own unique pair so a repeat flag
     * stays a no-op and a dismissal frees the reporter to flag again.
     */
    public function up(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            $table->foreignId('post_id')->nullable()->change();
            $table->foreignId('reported_user_id')->nullable()->after('post_id')->constrained('users')->cascadeOnDelete();
            $table->string('reason', 100)->change();

            $table->unique(['reported_user_id', 'reporter_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            $table->dropUnique(['reported_user_id', 'reporter_id']);
            $table->dropForeign(['reported_user_id']);
            $table->dropColumn('reported_user_id');
        });

        Schema::table('reports', function (Blueprint $table) {
            $table->foreignId('post_id')->constrained()->cascadeOnDelete()->change();
            $table->string('reason', 40)->change();
        });
    }
};
