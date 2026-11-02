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
        Schema::create('recompensas', function (Blueprint $table) {
            $table->id('ID_Rec');
            $table->foreignId('ID_Cli')->constrained('cliente', 'ID_Cli')->cascadeOnDelete();
            $table->string('Nom_Rec', 100);
            $table->text('Det_Rec')->nullable();
            $table->unsignedInteger('Cant_Rec')->default(0);
            $table->unsignedInteger('Niv_Desbl')->default(1);
            $table->boolean('Est_Desbl')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recompensas');
    }
};
