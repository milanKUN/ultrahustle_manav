<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('contracts', function (Blueprint $table) {
            $table->id();
            $table->string('contract_id')->unique();
            $table->string('title');
            $table->string('type')->default('Solo');
            $table->string('client_username')->nullable();
            $table->string('client_full_name')->nullable();
            $table->string('client_email')->nullable();
            $table->string('client_company')->nullable();
            $table->string('provider_username')->nullable();
            $table->string('provider_full_name')->nullable();
            $table->string('provider_email')->nullable();
            $table->string('provider_company')->nullable();
            $table->text('project_summary')->nullable();
            $table->text('out_of_scope')->nullable();
            $table->date('initial_delivery_deadline')->nullable();
            $table->string('client_review_window')->nullable();
            $table->integer('revision_rounds')->default(0);
            $table->string('revision_turnaround_time')->nullable();
            $table->string('late_delivery_consequence')->nullable();
            $table->text('delivery_sla')->nullable();
            $table->text('communication_sla')->nullable();
            $table->text('revision_sla')->nullable();
            $table->text('quality_standards')->nullable();
            $table->text('client_responsibilities')->nullable();
            $table->text('provider_responsibilities')->nullable();
            $table->string('payment_type')->nullable();
            $table->decimal('project_cost', 15, 2)->default(0);
            $table->string('status')->default('Open');
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('contracts');
    }
};
