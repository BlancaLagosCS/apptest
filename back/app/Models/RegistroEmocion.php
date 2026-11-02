<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RegistroEmocion extends Model
{
    protected $table = 'registro_emociones';

    protected $primaryKey = 'ID_Reg_Emo';

    protected $fillable = ['ID_Emo', 'ID_Usu', 'Date_Reg_Emo'];

    protected function casts(): array
    {
        return [
            'Date_Reg_Emo' => 'datetime',
        ];
    }

    public function emocion(): BelongsTo
    {
        return $this->belongsTo(TipEmo::class, 'ID_Emo', 'ID_Emo');
    }

    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class, 'ID_Usu', 'ID_Cli');
    }
}
