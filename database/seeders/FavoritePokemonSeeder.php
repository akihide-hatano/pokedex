<?php

namespace Database\Seeders;

use App\Models\User; // Userモデルをインポート
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class FavoritePokemonSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // まずは既存のお気に入りデータを全て削除 (開発中のみ推奨)
        DB::table('favorite_pokemons')->truncate();

        // ユーザーが存在することを確認または作成
        $testUser = User::where('email', 'test@example.com')->first();
        if (!$testUser) {
            // 'test@example.com' ユーザーが存在しない場合は作成
            $testUser = User::factory()->create([
                'name' => 'Test User',
                'email' => 'test@example.com',
                'password' => Hash::make('password'), // パスワードは'password'
            ]);
        }

        // Test Userにお気に入りポケモンを追加
        // addFavoritePokemonメソッドがboolを返すので、追加できたか確認
        if ($testUser->addFavoritePokemon(25)) { // ピカチュウ
            $this->command->info('Pikachu (ID 25) added to Test User favorites.');
        } else {
            $this->command->warn('Pikachu (ID 25) already exists in Test User favorites.');
        }
        if ($testUser->addFavoritePokemon(1)) { // フシギダネ
            $this->command->info('Bulbasaur (ID 1) added to Test User favorites.');
        } else {
            $this->command->warn('Bulbasaur (ID 1) already exists in Test User favorites.');
        }
        if ($testUser->addFavoritePokemon(7)) { // ゼニガメ
            $this->command->info('Squirtle (ID 7) added to Test User favorites.');
        } else {
            $this->command->warn('Squirtle (ID 7) already exists in Test User favorites.');
        }

        // 他のランダムなユーザーをいくつか取得し、お気に入りを追加
        // 全ユーザーから 'test@example.com' を除外したユーザーを取得
        $otherUsers = User::where('email', '!=', 'test@example.com')->inRandomOrder()->take(5)->get();

        foreach ($otherUsers as $user) {
            $pokemonIds = [];
            // 各ユーザーに3つのランダムなポケモンをお気に入り追加
            for ($j = 0; $j < 3; $j++) {
                $randomPokemonId = rand(1, 151); // 例: 1〜151のランダムなID
                if ($user->addFavoritePokemon($randomPokemonId)) {
                    $pokemonIds[] = $randomPokemonId;
                }
            }
            if (!empty($pokemonIds)) {
                $this->command->info("User ID {$user->id} ({$user->name}) added favorite pokemons: " . implode(', ', $pokemonIds));
            }
        }
    }
}