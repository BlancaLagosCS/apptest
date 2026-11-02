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
        Schema::create('tareas', function (Blueprint $table) {
            $table->id('ID_Tar');
            $table->foreignId('ID_Cli')->constrained('cliente', 'ID_Cli')->cascadeOnDelete();
            $table->foreignId('ID_Reg_Emo')->nullable()->constrained('registro_emociones', 'ID_Reg_Emo')->nullOnDelete();
            $table->string('Nom_Tar', 150);
            $table->time('Hora_Reg')->nullable();
            $table->dateTime('Inicio')->nullable();
            $table->dateTime('Deadline')->nullable();
            $table->unsignedTinyInteger('Dificultad')->default(1);
            // Pendiente, Realizada o Eliminada (las eliminadas se conservan, no se borran)
            $table->string('Est_Tar', 20)->default('Pendiente');
            $table->dateTime('Fecha_Real')->nullable();
            $table->timestamps();

            $table->index(['ID_Cli', 'Est_Tar']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tareas');
    }
};
