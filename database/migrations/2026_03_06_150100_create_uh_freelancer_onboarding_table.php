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
        Schema::create('uh_freelancer_onboarding', function (Blueprint $table): void {
            $table->id();
            $table->string('uh_user_id')->unique();
            $table->enum('onboarding_role', ['creator'])->default('creator');

            $table->enum('work_type', ['solo', 'team'])->nullable();
            $table->string('team_industry', 50)->nullable();
            $table->enum('team_build_plan', ['yes', 'no', 'maybe later'])->nullable();

            $table->json('goals_json')->nullable();

            $table->json('service_categories_json')->nullable();
            $table->string('primary_skill', 191)->nullable();
            $table->enum('experience_level', ['beginner', 'intermediate', 'pro', 'expert'])->nullable();
            $table->string('rate_range', 50)->nullable();
            $table->enum('has_portfolio', ['yes', 'no'])->nullable();
            $table->text('portfolio_links')->nullable();

            $table->unsignedTinyInteger('current_step')->default(0);
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->foreign('uh_user_id')
                ->references('uh_user_id')
                ->on('users')
                ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('uh_freelancer_onboarding');
    }
};
