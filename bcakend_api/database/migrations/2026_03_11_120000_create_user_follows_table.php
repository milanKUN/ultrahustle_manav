<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_follows', function (Blueprint $table) {
            $table->id();

            $table->foreignId('follower_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->foreignId('following_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->timestamps();

            $table->unique(['follower_id', 'following_id'], 'user_follows_follower_following_uq');
            $table->index(['following_id', 'created_at'], 'user_follows_following_created_idx');
            $table->index(['follower_id', 'created_at'], 'user_follows_follower_created_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_follows');
    }
};
