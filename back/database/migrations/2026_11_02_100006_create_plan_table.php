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
        Schema::create('plan', function (Blueprint $table) {
            $table->id('ID_Plan');
            $table->foreignId('ID_tipPlan')->constrained('tipo_plan', 'ID_tipPlan')->restrictOnDelete();
            $table->unsignedInteger('Plazo');
            $table->boolean('Est_Plan')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plan');
    }
};
