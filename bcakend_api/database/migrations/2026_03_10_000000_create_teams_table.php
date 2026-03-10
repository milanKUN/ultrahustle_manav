<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('teams', function (Blueprint $table) {
            $table->id();

            $table->foreignId('owner_user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->string('name', 50);
            $table->string('username', 30);

            $table->string('title', 40)->nullable();
            $table->string('bio', 160)->nullable();
            $table->string('about', 700)->nullable();
            $table->string('what_we_do', 700)->nullable();

            $table->string('category', 50);
            $table->string('availability', 32)->nullable();
            $table->text('terms')->nullable();

            $table->json('hashtags')->nullable();
            $table->json('skills')->nullable();
            $table->json('tools')->nullable();
            $table->json('languages')->nullable();
            $table->json('rules')->nullable();

            $table->string('avatar_path')->nullable();
            $table->string('avatar_filename')->nullable();
            $table->string('avatar_mime')->nullable();
            $table->unsignedBigInteger('avatar_size')->nullable();
            $table->timestampTz('avatar_updated_at')->nullable();

            $table->timestampsTz();
            $table->softDeletesTz();

            $table->index('owner_user_id', 'teams_owner_user_id_idx');
            $table->index('category', 'teams_category_idx');
            $table->index('availability', 'teams_availability_idx');
        });

        $driver = DB::getDriverName();

        if ($driver === 'pgsql') {
            DB::statement("create unique index if not exists teams_username_uq on teams (lower(username))");
        } elseif ($driver === 'sqlite') {
            DB::statement("create unique index if not exists teams_username_uq on teams(username collate nocase)");
        } else {
            Schema::table('teams', function (Blueprint $table) {
                $table->unique('username', 'teams_username_uq');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('teams');
    }
};
