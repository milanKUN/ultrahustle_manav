<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('team_invitations', function (Blueprint $table) {
            $table->id();

            $table->foreignId('team_id')
                ->constrained('teams')
                ->cascadeOnDelete();

            $table->string('email', 254);

            $table->foreignId('invited_user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->foreignId('invited_by_user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->string('role', 32);
            $table->string('member_title', 60)->nullable();

            $table->string('token_hash', 64);

            $table->timestampTz('expires_at');
            $table->timestampTz('accepted_at')->nullable();
            $table->timestampTz('declined_at')->nullable();
            $table->timestampTz('revoked_at')->nullable();
            $table->timestampTz('last_sent_at')->nullable();

            $table->unsignedInteger('send_count')->default(0);

            $table->timestampsTz();

            $table->index('token_hash', 'team_invitations_token_hash_idx');
            $table->index(['team_id', 'email'], 'team_invitations_team_email_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('team_invitations');
    }
};
