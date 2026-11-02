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
        Schema::create('reflexiones', function (Blueprint $table) {
            $table->id('ID_Ref');
            $table->foreignId('ID_Tar')->nullable()->constrained('tareas', 'ID_Tar')->nullOnDelete();
            $table->foreignId('ID_Cli')->constrained('cliente', 'ID_Cli')->cascadeOnDelete();
            $table->string('Nom_Ref', 150);
            $table->text('Contenido');
            $table->dateTime('Date_Ref');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reflexiones');
    }
};
