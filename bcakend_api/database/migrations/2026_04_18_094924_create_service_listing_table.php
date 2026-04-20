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
        Schema::create('service_listing_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('listing_id')->unique();
            $table->string('product_type', 150)->nullable();
            $table->longText('packages_json')->nullable();
            $table->longText('add_ons_json')->nullable();
            $table->timestamps();

            $table->foreign('listing_id')
                ->references('id')
                ->on('listings')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_listing_details');
    }
};
