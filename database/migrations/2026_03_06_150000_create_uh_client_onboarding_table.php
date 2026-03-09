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
        Schema::create('uh_client_onboarding', function (Blueprint $table): void {
            $table->id();
            $table->string('uh_user_id')->unique();
            $table->enum('onboarding_role', ['client'])->default('client');

            $table->enum('work_type', ['solo', 'team'])->nullable();
            $table->string('team_industry', 50)->nullable();
            $table->enum('team_build_plan', ['yes', 'no', 'maybe later'])->nullable();

            $table->json('goals_json')->nullable();

            $table->json('needs_categories_json')->nullable();
            $table->string('avg_project_budget', 50)->nullable();
            $table->enum('expected_frequency', ['once', 'monthly', 'weekly'])->nullable();
            $table->enum('hiring_for_team', ['yes', 'no'])->nullable();
            $table->string('hiring_business_name', 191)->nullable();
            $table->string('hiring_role', 191)->nullable();

            $table->boolean('is_personal_account')->default(false);
            $table->string('business_name', 191)->nullable();
            $table->unsignedInteger('employees')->nullable();
            $table->string('business_industry', 50)->nullable();
            $table->string('other_industry', 191)->nullable();
            $table->string('website', 255)->nullable();
            $table->string('tax_id', 64)->nullable();
            $table->string('country', 64)->nullable();
            $table->string('state', 64)->nullable();
            $table->string('city', 64)->nullable();

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
        Schema::dropIfExists('uh_client_onboarding');
    }
};
