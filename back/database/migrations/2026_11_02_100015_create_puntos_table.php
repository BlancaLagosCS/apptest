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
        Schema::create('puntos', function (Blueprint $table) {
            $table->id('ID_Punt');
            $table->foreignId('ID_Cli')->constrained('cliente', 'ID_Cli')->cascadeOnDelete();
            $table->foreignId('ID_Reg')->nullable()->constrained('registro_emociones', 'ID_Reg_Emo')->nullOnDelete();
            $table->foreignId('ID_Tar')->nullable()->constrained('tareas', 'ID_Tar')->nullOnDelete();
            $table->integer('Cant_Pun')->default(0);
            $table->integer('Cont_Tot')->default(0);
            $table->integer('Cont_Hist')->default(0);
            $table->foreignId('ID_Rec')->nullable()->constrained('recompensas', 'ID_Rec')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('puntos');
    }
};
