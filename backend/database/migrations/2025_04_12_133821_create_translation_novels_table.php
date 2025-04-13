<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('translation_novels', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('synopsis')->nullable();
            $table->string('genre')->nullable();
            $table->string('author')->nullable();
            $table->string('cover')->nullable();
            $table->string('status')->nullable();
            $table->string('views')->nullable();
            $table->decimal('ratings', 3, 1)->nullable()->default(0);
            $table->boolean('featured')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('translation_novels');
    }
};