<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('team_memberships', function (Blueprint $table) {
            $table->id();

            $table->foreignId('team_id')
                ->constrained('teams')
                ->cascadeOnDelete();

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->string('role', 32);
            $table->string('member_title', 60)->nullable();

            $table->timestampTz('joined_at')->nullable();
            $table->timestampTz('left_at')->nullable();

            $table->timestampsTz();

            $table->unique(['team_id', 'user_id'], 'team_memberships_team_user_uq');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('team_memberships');
    }
};
