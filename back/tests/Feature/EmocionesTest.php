<?php

namespace Tests\Feature;

use App\Models\Cliente;
use Database\Seeders\TipEmoSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class EmocionesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(TipEmoSeeder::class);
    }

    private function crearCliente(): Cliente
    {
        return Cliente::create([
            'Nom_Cli' => 'Ana',
            'Email' => 'ana@example.com',
            'Clave_Cli' => 'secreto123',
        ]);
    }

    public function test_lista_las_emociones_sembradas(): void
    {
        $this->getJson('/api/emociones')
            ->assertOk()
            ->assertExactJson([
                ['ID_Emo' => 1, 'Nom_Emo' => 'Mal', 'Dificultad' => 2],
                ['ID_Emo' => 2, 'Nom_Emo' => 'Bien', 'Dificultad' => 1],
                ['ID_Emo' => 3, 'Nom_Emo' => 'Excelente', 'Dificultad' => 1],
            ]);
    }

    public function test_registrar_emocion_requiere_autenticacion(): void
    {
        $this->postJson('/api/registro-emociones', ['ID_Emo' => 1])->assertUnauthorized();
    }

    public function test_cliente_autenticado_registra_su_emocion(): void
    {
        $cliente = $this->crearCliente();
        Sanctum::actingAs($cliente);

        $this->postJson('/api/registro-emociones', [
            'ID_Emo' => 3,
            'Date_Reg_Emo' => '2026-11-01 08:30:00',
        ])->assertCreated();

        $this->assertDatabaseHas('registro_emociones', [
            'ID_Emo' => 3,
            'ID_Usu' => $cliente->ID_Cli,
            'Date_Reg_Emo' => '2026-11-01 08:30:00',
        ]);
    }

    public function test_rechaza_emocion_inexistente(): void
    {
        Sanctum::actingAs($this->crearCliente());

        $this->postJson('/api/registro-emociones', ['ID_Emo' => 99])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('ID_Emo');
    }

    public function test_el_token_de_un_cliente_autentica_la_peticion(): void
    {
        $token = $this->crearCliente()->createToken('app')->plainTextToken;

        $this->withToken($token)
            ->postJson('/api/registro-emociones', ['ID_Emo' => 2])
            ->assertCreated();
    }
}
