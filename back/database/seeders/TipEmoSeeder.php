<?php

namespace Database\Seeders;

use App\Models\TipEmo;
use Illuminate\Database\Seeder;

class TipEmoSeeder extends Seeder
{
    /**
     * Estados de ánimo de la pantalla previa al landing. Los IDs son fijos
     * porque la app móvil los usa como respaldo sin conexión.
     */
    public function run(): void
    {
        $emociones = [
            ['ID_Emo' => 1, 'Nom_Emo' => 'Mal', 'Dificultad' => 2],
            ['ID_Emo' => 2, 'Nom_Emo' => 'Bien', 'Dificultad' => 1],
            ['ID_Emo' => 3, 'Nom_Emo' => 'Excelente', 'Dificultad' => 1],
        ];

        foreach ($emociones as $emocion) {
            TipEmo::updateOrCreate(['ID_Emo' => $emocion['ID_Emo']], $emocion);
        }
    }
}
