<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\DB;

/**
 * Cada fila es un movimiento de granos: Cant_Pun es lo que cambia y
 * Cont_Tot / Cont_Hist guardan los contadores después del movimiento.
 */
class Punto extends Model
{
    protected $table = 'puntos';

    protected $primaryKey = 'ID_Punt';

    protected $fillable = ['ID_Cli', 'ID_Reg', 'ID_Tar', 'Cant_Pun', 'Cont_Tot', 'Cont_Hist', 'ID_Rec'];

    protected function casts(): array
    {
        return [
            'Cant_Pun' => 'integer',
            'Cont_Tot' => 'integer',
            'Cont_Hist' => 'integer',
        ];
    }

    /**
     * Suma (o resta, si es negativa) la cantidad al total disponible.
     * El histórico solo crece: los valores negativos no lo descuentan.
     */
    public static function registrar(Cliente $cliente, int $cantidad, ?Tarea $tarea = null): self
    {
        return DB::transaction(function () use ($cliente, $cantidad, $tarea) {
            // Bloquea al cliente para que dos movimientos simultáneos no lean el mismo saldo.
            Cliente::whereKey($cliente->ID_Cli)->lockForUpdate()->first();
            $anterior = $cliente->puntos()->latest('ID_Punt')->first();

            return self::create([
                'ID_Cli' => $cliente->ID_Cli,
                'ID_Tar' => $tarea?->ID_Tar,
                'Cant_Pun' => $cantidad,
                'Cont_Tot' => ($anterior->Cont_Tot ?? 0) + $cantidad,
                'Cont_Hist' => ($anterior->Cont_Hist ?? 0) + max($cantidad, 0),
            ]);
        });
    }

    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class, 'ID_Cli', 'ID_Cli');
    }

    public function tarea(): BelongsTo
    {
        return $this->belongsTo(Tarea::class, 'ID_Tar', 'ID_Tar');
    }
}
