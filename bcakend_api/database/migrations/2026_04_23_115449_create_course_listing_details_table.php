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
            $table->unsignedBigInteger('listing_id')->unique();

            $table->decimal('price', 15, 2)->nullable();
            $table->string('product_type')->nullable();
            $table->string('course_level')->nullable();

            $table->json('tools_json')->nullable();
            $table->json('languages_json')->nullable();
            $table->json('learning_points_json')->nullable();
            $table->json('included_json')->nullable();
            $table->json('prerequisites_json')->nullable();

            $table->string('preview_video_path')->nullable();
            $table->text('preview_video_url')->nullable();

            $table->timestamps();

            $table->index('listing_id');
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
