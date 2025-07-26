<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // ユーザーがお気に入りのポケモンIDを取得する
    public function getFavoritePokemonIds(): array
    {
        return DB::table('favorite_pokemons')
                ->where('user_id',$this->id)
                ->pluck('pokemon_api_id')
                ->toArray();
    }

    //指定されたポケモンをお気に入りに追加する
    public function addFavoritePokemon( int $pokemonApiId):bool
    {
        if( ! DB::table('favorite_pokemons')
                ->where('user_id',$this->id)
                ->where('pokemon_api_id',$pokemonApiId)
                ->exists()){
            DB::table('favorite_pokemons')->insert([
                'user_id'=>$this->id,
                'pokemon_api_id'=> $pokemonApiId,
                // 'created_at' => now(), // もしtimestamps()をマイグレーションで有効にしたら、これらも追加
                // 'updated_at' => now(),
            ]);
            return true;
        }
        return false;
    }

    /**
     * 指定されたポケモンをお気に入りから削除する。
     *
     * @param int $pokemonApiId PokeAPIのポケモンID
     * @return int 削除された行数
     */
    public function removeFavoritePokemon(int $pokemonApiId): int
    {
        return DB::table('favorite_pokemons')
            ->where('user_id', $this->id)
            ->where('pokemon_api_id', $pokemonApiId)
            ->delete();
    }

    /**
     * 指定されたポケモンがこのユーザーのお気に入りに追加されているか確認する。
     *
     * @param int $pokemonApiId PokeAPIのポケモンID
     * @return bool
     */
    public function isFavoritePokemon(int $pokemonApiId): bool
    {
        return DB::table('favorite_pokemons')
                  ->where('user_id', $this->id)
                  ->where('pokemon_api_id', $pokemonApiId)
                  ->exists();
    }
}