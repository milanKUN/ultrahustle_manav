<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('contract_milestones', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('contract_record_id');
            $table->string('title');
            $table->decimal('amount', 15, 2);
            $table->date('deadline')->nullable();
            $table->string('status')->default('Open');
            $table->timestamps();

            $table->foreign('contract_record_id')->references('id')->on('contracts')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('contract_milestones');
    }
};
