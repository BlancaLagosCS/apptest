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
        Schema::create('estadisticas_uso', function (Blueprint $table) {
            $table->id('ID_Estadistica');
            $table->foreignId('ID_Cli')->constrained('cliente', 'ID_Cli')->cascadeOnDelete();
            $table->unsignedInteger('Cant_Tar')->default(0);
            $table->unsignedInteger('Cant_Refl')->default(0);
            $table->unsignedInteger('Cant_Reg_Emo')->default(0);
            $table->decimal('Valoraciones', 3, 2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('estadisticas_uso');
    }
};
