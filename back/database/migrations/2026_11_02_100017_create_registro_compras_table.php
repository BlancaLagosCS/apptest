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
        Schema::create('registro_compras', function (Blueprint $table) {
            $table->id('ID_RegCom');
            // Nullable para conservar el historial de compras si se elimina el cliente
            $table->foreignId('ID_Cli')->nullable()->constrained('cliente', 'ID_Cli')->nullOnDelete();
            $table->foreignId('ID_Ent')->constrained('tipo_entidad', 'ID_Ent')->restrictOnDelete();
            $table->decimal('Pago', 10, 2);
            $table->unsignedInteger('Cantidad')->default(1);
            $table->dateTime('Fecha');
            $table->date('Vigencia')->nullable();
            $table->string('Medio_pago', 50);
            $table->foreignId('ID_tipPlan')->constrained('tipo_plan', 'ID_tipPlan')->restrictOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('registro_compras');
    }
};
