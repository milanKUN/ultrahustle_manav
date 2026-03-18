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
        Schema::table('portfolio_projects', function (Blueprint $table) {
            $table->primary('id');
            // Add index (if not exists)
            $table->index('portfolio_id');

            // Add foreign key
            $table->foreign('portfolio_id')
                ->references('id')
                ->on('portfolios')
                ->cascadeOnDelete();
        });
        Schema::table('portfolio_projects', function (Blueprint $table) {
            $table->primary('id');
            // Add index (if not exists)
            $table->index('portfolio_id');

            // Add foreign key
            $table->foreign('portfolio_id')
                ->references('id')
                ->on('portfolios')
                ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('portfolio_projects', function (Blueprint $table) {
            $table->primary('id');
            // Add index (if not exists)
            $table->index('portfolio_id');

            // Add foreign key
            $table->foreign('portfolio_id')
                ->references('id')
                ->on('portfolios')
                ->cascadeOnDelete();
        });
        Schema::table('portfolio_projects', function (Blueprint $table) {
            $table->primary('id');
            // Add index (if not exists)
            $table->index('portfolio_id');

            // Add foreign key
            $table->foreign('portfolio_id')
                ->references('id')
                ->on('portfolios')
                ->cascadeOnDelete();
        });
    }
};
