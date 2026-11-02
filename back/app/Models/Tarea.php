<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Tarea extends Model
{
    public const DIFICULTAD_FACIL = 1;

    public const DIFICULTAD_INTERMEDIO = 2;

    public const DIFICULTAD_DIFICIL = 3;

    protected $table = 'tareas';

    protected $primaryKey = 'ID_Tar';

    protected $fillable = ['ID_Cli', 'ID_Reg_Emo', 'Nom_Tar', 'Hora_Reg', 'Inicio', 'Deadline', 'Dificultad'];

    protected function casts(): array
    {
        return [
            'Inicio' => 'datetime:Y-m-d H:i:s',
            'Deadline' => 'datetime:Y-m-d H:i:s',
            'Dificultad' => 'integer',
        ];
    }

    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class, 'ID_Cli', 'ID_Cli');
    }

    public function registroEmocion(): BelongsTo
    {
        return $this->belongsTo(RegistroEmocion::class, 'ID_Reg_Emo', 'ID_Reg_Emo');
    }
}
