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
        Schema::create('digital_product_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('listing_id')->unique();
            $table->string('product_type', 150)->nullable();
            $table->decimal('price', 10, 2)->nullable();
            $table->longText('included_json')->nullable();
            $table->string('delivery_format', 255)->nullable();
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
        Schema::dropIfExists('digital_product_details');
    }
};
