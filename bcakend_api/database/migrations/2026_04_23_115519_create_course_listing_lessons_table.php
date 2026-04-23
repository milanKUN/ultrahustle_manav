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
        Schema::create('course_listing_lessons', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('listing_id');
            $table->string('title');
            $table->longText('description')->nullable();

            $table->enum('media_type', ['video', 'link', 'file'])->default('video');
            $table->string('media_path')->nullable();
            $table->text('external_url')->nullable();

            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index('listing_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_listing_lessons');
    }
};
