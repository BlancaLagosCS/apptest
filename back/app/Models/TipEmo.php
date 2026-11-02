<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TipEmo extends Model
{
    protected $table = 'tip_emo';

    protected $primaryKey = 'ID_Emo';

    protected $fillable = ['ID_Emo', 'Nom_Emo', 'Dificultad'];

    protected function casts(): array
    {
        return [
            'Dificultad' => 'integer',
        ];
    }

    public function registros(): HasMany
    {
        return $this->hasMany(RegistroEmocion::class, 'ID_Emo', 'ID_Emo');
    }
}
