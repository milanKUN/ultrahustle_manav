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
        Schema::create('order_webinar_agenda_progress', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('order_id');
            $table->unsignedBigInteger('agenda_item_id');
            $table->unsignedBigInteger('user_id');
            $table->boolean('watched')->default(false);
            $table->timestamp('watched_at')->nullable();
            $table->timestamps();

            $table->unique(['order_id', 'agenda_item_id', 'user_id'], 'owap_unique_progress');

            $table->index('order_id');
            $table->index('agenda_item_id');
            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_webinar_agenda_progress');
    }
};
