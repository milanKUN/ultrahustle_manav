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
        Schema::create('order_course_lesson_progress', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('order_id');
            $table->unsignedBigInteger('lesson_id');
            $table->unsignedBigInteger('user_id');
            $table->boolean('watched')->default(false);
            $table->timestamp('watched_at')->nullable();
            $table->timestamps();

            $table->unique(['order_id', 'lesson_id', 'user_id'], 'oclp_unique_progress');

            $table->index('order_id');
            $table->index('lesson_id');
            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_course_lesson_progress');
    }
};
