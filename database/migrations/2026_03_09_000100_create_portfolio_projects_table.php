<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
	public function up(): void
	{
		Schema::create('portfolio_projects', function (Blueprint $table): void {
			$table->id();
			$table->foreignId('portfolio_id')->constrained('portfolios')->cascadeOnDelete();
			$table->string('title');
			$table->text('description')->nullable();
			$table->unsignedBigInteger('cost_cents')->nullable();
			$table->char('currency', 3)->default('INR');
			$table->unsignedInteger('sort_order')->default(0);
			$table->timestamps();

			$table->index('portfolio_id');
		});
	}

	public function down(): void
	{
		Schema::dropIfExists('portfolio_projects');
	}
};
