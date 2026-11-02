<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Cliente extends Authenticatable
{
    use HasApiTokens;

    protected $table = 'cliente';

    protected $primaryKey = 'ID_Cli';

    protected $fillable = ['ID_Plan', 'ID_Masc', 'Nom_Cli', 'Edad', 'Nivel', 'Clave_Cli', 'Email', 'ID_Gen'];

    protected $hidden = ['Clave_Cli'];

    protected function casts(): array
    {
        return [
            'Clave_Cli' => 'hashed',
        ];
    }

    /**
     * La contraseña se guarda en Clave_Cli en lugar de "password".
     */
    public function getAuthPasswordName(): string
    {
        return 'Clave_Cli';
    }

    public function registrosEmociones(): HasMany
    {
        return $this->hasMany(RegistroEmocion::class, 'ID_Usu', 'ID_Cli');
    }

    public function tareas(): HasMany
    {
        return $this->hasMany(Tarea::class, 'ID_Cli', 'ID_Cli');
    }
}
