<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PokemonController extends Controller
{
    //ポケモン図鑑の表示
    public function index(){
        return view('pokemon.index');
    }

    /**
     * 特定のポケモン詳細ページを表示する
     * {pokemon} パラメータは $pokemon として渡される
     */
    public function show(string $pokemon)
    {
        $pokemonId = $pokemon; // $pokemon を $pokemonId に再代入
        return view('pokemon.show', compact('pokemonId')); // ★compact() を使用
    }
}
