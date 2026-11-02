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
        Schema::create('mascota', function (Blueprint $table) {
            $table->id('ID_Masc');
            $table->foreignId('ID_Cli')->constrained('cliente', 'ID_Cli')->cascadeOnDelete();
            $table->string('Nom_Masc', 50);
            $table->unsignedInteger('Nivel')->default(1);
            $table->string('Skin', 50)->nullable();
            $table->string('Est_Masc', 30)->default('activo');
            $table->json('Dialogos')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mascota');
    }
};
