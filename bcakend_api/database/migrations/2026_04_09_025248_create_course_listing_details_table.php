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
        Schema::create('course_listing_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('listing_id')->constrained('listings')->cascadeOnDelete();

            $table->string('course_level')->nullable();
            $table->json('learning_points_json')->nullable();
            $table->json('languages_json')->nullable();

            $table->string('preview_video_path')->nullable();
            $table->string('preview_video_name')->nullable();
            $table->string('preview_video_mime')->nullable();
            $table->unsignedBigInteger('preview_video_size')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_listing_details');
    }
};
