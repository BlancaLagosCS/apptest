<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Tarea extends Model
{
    public const DIFICULTAD_FACIL = 1;

    public const DIFICULTAD_INTERMEDIO = 2;

    public const DIFICULTAD_DIFICIL = 3;

    public const ESTADO_PENDIENTE = 'Pendiente';

    public const ESTADO_REALIZADA = 'Realizada';

    public const ESTADO_ELIMINADA = 'Eliminada';

    public const ESTADOS = [self::ESTADO_PENDIENTE, self::ESTADO_REALIZADA, self::ESTADO_ELIMINADA];

    protected $table = 'tareas';

    protected $primaryKey = 'ID_Tar';

    protected $fillable = ['ID_Cli', 'ID_Reg_Emo', 'Nom_Tar', 'Hora_Reg', 'Inicio', 'Deadline', 'Dificultad', 'Est_Tar', 'Fecha_Real'];

    protected function casts(): array
    {
        return [
            'Inicio' => 'datetime:Y-m-d H:i:s',
            'Deadline' => 'datetime:Y-m-d H:i:s',
            'Fecha_Real' => 'datetime:Y-m-d H:i:s',
            'Dificultad' => 'integer',
        ];
    }

    /**
     * Cambia el estado; Fecha_Real registra cuándo se realizó la tarea.
     */
    public function cambiarEstado(string $estado): void
    {
        $this->update([
            'Est_Tar' => $estado,
            'Fecha_Real' => $estado === self::ESTADO_REALIZADA ? now() : null,
        ]);
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
