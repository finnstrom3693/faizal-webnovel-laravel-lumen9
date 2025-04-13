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
        Schema::create('translation_novel_chapters', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->unsignedBigInteger('novel_id')->index(); // add index for foreign key
            $table->unsignedBigInteger('views')->default(0); // should be numeric, not string
            $table->text('content');
            $table->timestamps();
        
            $table->foreign('novel_id')
                  ->references('id')
                  ->on('translation_novels')
                  ->onDelete('cascade');
        });   
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('translation_novel_chapters');
    }
};
