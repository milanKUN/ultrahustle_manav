<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('contract_deliverables', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('contract_record_id');
            $table->string('title');
            $table->string('format')->nullable();
            $table->string('quantity')->nullable();
            $table->text('acceptance_criteria')->nullable();
            $table->timestamps();

            $table->foreign('contract_record_id')->references('id')->on('contracts')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('contract_deliverables');
    }
};
