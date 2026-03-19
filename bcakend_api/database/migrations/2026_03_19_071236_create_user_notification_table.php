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
        Schema::create('user_notification', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->unique() // one row per user
                ->constrained()
                ->cascadeOnDelete();

            // EMAIL
            $table->boolean('messages')->default(true);
            $table->boolean('order')->default(false);
            $table->boolean('reviews')->default(true);
            $table->boolean('payment')->default(false);
            $table->boolean('boost')->default(true);
            $table->boolean('listing')->default(false);
            $table->boolean('system')->default(true);

            // PUSH
            $table->boolean('project')->default(false);
            $table->boolean('comments')->default(true);
            $table->boolean('forum')->default(false);
            $table->boolean('team')->default(true);

            // MARKETING
            $table->boolean('marketing')->default(true);
            $table->boolean('product')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_notification');
    }
};
