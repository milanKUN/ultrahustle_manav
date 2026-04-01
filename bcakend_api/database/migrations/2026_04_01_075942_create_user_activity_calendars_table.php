<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user_activity_calendars', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->smallInteger('year');
            $table->tinyInteger('month');
            $table->json('active_days')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'year', 'month'], 'user_year_month_unique');
            $table->index(['user_id', 'year']);
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        // Optional but recommended
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'last_login_at')) {
                $table->timestamp('last_login_at')->nullable()->after('remember_token');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_activity_calendars');
    }
};
