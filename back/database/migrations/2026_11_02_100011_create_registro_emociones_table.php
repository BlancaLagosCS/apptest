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
        Schema::create('registro_emociones', function (Blueprint $table) {
            $table->id('ID_Reg_Emo');
            $table->foreignId('ID_Emo')->constrained('tip_emo', 'ID_Emo')->restrictOnDelete();
            $table->foreignId('ID_Usu')->constrained('cliente', 'ID_Cli')->cascadeOnDelete();
            $table->dateTime('Date_Reg_Emo');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('registro_emociones');
    }
};
