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
        Schema::create('cliente', function (Blueprint $table) {
            $table->id('ID_Cli');
            $table->foreignId('ID_Plan')->nullable()->constrained('plan', 'ID_Plan')->nullOnDelete();
            // La FK hacia mascota se agrega en una migración posterior (referencia circular)
            $table->unsignedBigInteger('ID_Masc')->nullable();
            $table->string('Nom_Cli', 100);
            $table->unsignedTinyInteger('Edad')->nullable();
            $table->unsignedInteger('Nivel')->default(1);
            $table->string('Clave_Cli');
            $table->string('Email')->unique();
            $table->foreignId('ID_Gen')->nullable()->constrained('genero', 'ID_Gen')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cliente');
    }
};
