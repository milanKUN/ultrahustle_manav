<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
	public function up(): void
	{
		Schema::create('portfolio_media', function (Blueprint $table): void {
			$table->id();
			$table->foreignId('project_id')->constrained('portfolio_projects')->cascadeOnDelete();
			$table->string('type');
			$table->string('disk')->default('public');
			$table->string('path');
			$table->text('url')->nullable();
			$table->string('mime')->nullable();
			$table->unsignedBigInteger('size_bytes')->nullable();
			$table->boolean('is_cover')->default(false);
			$table->unsignedInteger('sort_order')->default(0);
			$table->timestamps();

			$table->index('project_id');
		});
	}

	public function down(): void
	{
		Schema::dropIfExists('portfolio_media');
	}
};
