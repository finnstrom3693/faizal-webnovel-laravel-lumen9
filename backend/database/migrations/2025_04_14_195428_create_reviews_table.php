<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReviewsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id(); // Integer primary key, auto-incrementing
            $table->unsignedBigInteger('novel_id');
            $table->unsignedBigInteger('user_id');
            $table->tinyInteger('rating')->unsigned();
            $table->string('title')->nullable();
            $table->text('content')->nullable();
            $table->timestamps(); 
            
            $table->foreign('novel_id')->references('id')->on('novels')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            $table->unique(['novel_id', 'user_id']);
            $table->check('rating BETWEEN 1 AND 5');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('reviews');
    }
}