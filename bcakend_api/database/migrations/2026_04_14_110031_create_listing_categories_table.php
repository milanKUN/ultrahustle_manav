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
        Schema::create('listing_categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('listing_type_id')->constrained('listing_types')->cascadeOnDelete();
            $table->string('name', 150);
            $table->string('slug', 180);
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->unique(['listing_type_id', 'slug'], 'uniq_listing_type_category_slug');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('listing_categories');
    }
};
