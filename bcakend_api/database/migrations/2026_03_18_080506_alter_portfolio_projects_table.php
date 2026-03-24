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
        /* Schema::table('portfolio_media', function (Blueprint $table) {
            $table->primary('id');
            // Add index
            $table->index('project_id');

            // Add foreign key
            $table->foreign('project_id')
                ->references('id')
                ->on('portfolio_projects')
                ->cascadeOnDelete();
        }); */
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        
        Schema::table('portfolio_media', function (Blueprint $table) {
            $table->primary('id');
            // Add index
            $table->index('project_id');

            // Add foreign key
            $table->foreign('project_id')
                ->references('id')
                ->on('portfolio_projects')
                ->cascadeOnDelete();
        });
    }
};
