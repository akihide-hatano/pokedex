// DOM要素の取得 (既存の部分)
const pokemonListElement = document.getElementById('pokemonList');
const prevPageButton = document.getElementById('prevPage');
const nextPageButton = document.getElementById('nextPage');

// ★★★ ここからモーダル関連のDOM要素を取得する部分を追加 ★★★
const pokemonModal = document.getElementById('pokemonModal');
const closeModalButton = document.getElementById('closeModal');
const modalContent = document.getElementById('modalContent');
// ★★★ モーダル関連DOM要素取得ここまで ★★★

let nextUrl = null;
let prevUrl = null;

/**
 * PokeAPIからポケモンデータを非同期で取得し、リストに表示する関数
 * @param {string} url - データを取得するPokeAPIのエンドポイントURL
 */
async function fetchAndDisplayPokemons(url) {
    pokemonListElement.innerHTML = '<p class="text-center col-span-full text-gray-500 text-lg">ポケモンのデータを読み込み中...</p>';

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTPエラー発生！ステータス: ${response.status} (${response.statusText})`);
        }

        const data = await response.json();

        nextUrl = data.next;
        prevUrl = data.previous;

        prevPageButton.disabled = !prevUrl;
        nextPageButton.disabled = !nextUrl;

        pokemonListElement.innerHTML = ''; // 古いリストをクリア

        for (const pokemon of data.results) {
            // ポケモンカードのHTML要素を動的に作成
            const pokemonCard = document.createElement('div');
            pokemonCard.classList.add('pokemon-card', 'bg-white', 'p-6', 'rounded-xl', 'shadow-lg', 'text-center', 'transform', 'hover:scale-105', 'transition-transform', 'duration-200', 'cursor-pointer'); // ★ 'cursor-pointer' を追加

            // ★ dataset 属性にポケモンの詳細URLを保存
            pokemonCard.dataset.pokemonUrl = pokemon.url;

            pokemonCard.innerHTML = `
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${extractIdFromUrl(pokemon.url)}.png" alt="${pokemon.name}" class="mx-auto w-28 h-28 mb-4">
                <h3 class="text-xl font-bold capitalize text-gray-800">${pokemon.name}</h3>
                <p class="text-sm text-gray-600 mt-1">ID: #${String(extractIdFromUrl(pokemon.url)).padStart(3, '0')}</p>
                {{-- タイプ情報は詳細データ取得後に表示するため、ここでは表示しない --}}
            `;
            pokemonListElement.appendChild(pokemonCard);
        }

    } catch (error) {
        pokemonListElement.innerHTML = `<p class="text-center col-span-full text-red-500 text-lg">データの取得中にエラーが発生しました: ${error.message}</p>`;
        console.error('APIデータの取得中にエラーが発生しました:', error);
    }
}

// URLからIDを抽出するヘルパー関数 (既存)
function extractIdFromUrl(url) {
    const parts = url.split('/');
    return parts[parts.length - 2];
}

// ポケモンのタイプに応じた Tailwind CSS クラスを返すヘルパー関数 (既存)
function getTypeColorClass(type) {
    switch (type) {
        case 'normal': return 'bg-gray-300 text-gray-800';
        case 'fire': return 'bg-red-500 text-white';
        case 'water': return 'bg-blue-500 text-white';
        case 'grass': return 'bg-green-500 text-white';
        case 'electric': return 'bg-yellow-400 text-gray-800';
        case 'ice': return 'bg-blue-300 text-gray-800';
        case 'fighting': return 'bg-orange-700 text-white';
        case 'poison': return 'bg-purple-600 text-white';
        case 'ground': return 'bg-yellow-700 text-white';
        case 'flying': return 'bg-indigo-300 text-gray-800';
        case 'psychic': return 'bg-pink-500 text-white';
        case 'bug': return 'bg-lime-600 text-white';
        case 'rock': return 'bg-amber-700 text-white';
        case 'ghost': return 'bg-purple-800 text-white';
        case 'dragon': return 'bg-indigo-700 text-white';
        case 'steel': return 'bg-blue-gray-400 text-gray-800';
        case 'fairy': return 'bg-pink-300 text-gray-800';
        default: return 'bg-gray-200 text-gray-800';
    }
}

// ★★★ ここからモーダル表示ロジックの追加 ★★★

// 詳細データを取得し、モーダルに表示する関数
async function displayPokemonDetails(pokemonUrl) {
    modalContent.innerHTML = '<p class="text-gray-500">詳細データを読み込み中...</p>'; // ローディング表示
    pokemonModal.classList.remove('hidden'); // モーダルを表示

    try {
        const response = await fetch(pokemonUrl);
        if (!response.ok) {
            throw new Error(`HTTPエラー発生！ステータス: ${response.status} (${response.statusText})`);
        }
        const detailData = await response.json();

        // モーダルの内容を動的に生成
        modalContent.innerHTML = `
            <h2 class="text-3xl font-bold capitalize mb-4">${detailData.name}</h2>
            <img src="${detailData.sprites.front_default}" alt="${detailData.name}" class="mx-auto w-40 h-40 mb-4">
            <p class="text-lg text-gray-700 mb-2">ID: #${String(detailData.id).padStart(3, '0')}</p>
            <div class="mt-3 flex justify-center space-x-2 mb-4">
                ${detailData.types.map(typeInfo => `
                    <span class="px-4 py-2 text-sm font-semibold rounded-full ${getTypeColorClass(typeInfo.type.name)}">
                        ${typeInfo.type.name}
                    </span>
                `).join('')}
            </div>
            <div class="grid grid-cols-2 gap-2 text-left mb-4">
                <p><strong>高さ:</strong> ${detailData.height / 10} m</p>
                <p><strong>重さ:</strong> ${detailData.weight / 10} kg</p>
                <p class="col-span-2"><strong>特性:</strong> ${detailData.abilities.map(abilityInfo => abilityInfo.ability.name).join(', ')}</p>
            </div>
            <p class="text-sm text-gray-600">
                ${detailData.flavor_text_entries && detailData.flavor_text_entries.length > 0
                    ? detailData.flavor_text_entries.find(entry => entry.language.name === 'en')?.flavor_text || ''
                    : ''}
            </p>
        `;

    } catch (error) {
        modalContent.innerHTML = `<p class="text-red-500">詳細データの取得中にエラーが発生しました: ${error.message}</p>`;
        console.error('詳細データの取得中にエラーが発生しました:', error);
    }
}

// イベントデリゲーション: pokemonListElement にクリックイベントリスナーを設定
// これにより、動的に生成されたポケモンカードのクリックも検知できる
pokemonListElement.addEventListener('click', (event) => {
    const clickedCard = event.target.closest('.pokemon-card'); // クリックされた要素から最も近いポケモンカード要素を探す
    if (clickedCard) {
        const pokemonUrl = clickedCard.dataset.pokemonUrl; // dataset からURLを取得
        if (pokemonUrl) {
            displayPokemonDetails(pokemonUrl); // 詳細表示関数を呼び出す
        }
    }
});

// モーダルを閉じるボタンのイベントリスナー
closeModalButton.addEventListener('click', () => {
    pokemonModal.classList.add('hidden'); // モーダルを非表示にする
});

// モーダルの背景をクリックしても閉じるようにする
pokemonModal.addEventListener('click', (event) => {
    if (event.target === pokemonModal) { // モーダルの背景部分がクリックされた場合のみ
        pokemonModal.classList.add('hidden');
    }
});

// ★★★ モーダル表示ロジックの追加ここまで ★★★


// ページネーションボタンのイベントリスナーを設定 (既存)
const initialUrl = 'https://pokeapi.co/api/v2/pokemon?limit=20&offset=0';
nextPageButton.addEventListener('click', () => {
    if (nextUrl) {
        fetchAndDisplayPokemons(nextUrl);
    }
});
prevPageButton.addEventListener('click', () => {
    if (prevUrl) {
        fetchAndDisplayPokemons(prevUrl);
    }
});

// ページが完全に読み込まれたときに、最初のポケモンリストを取得して表示 (既存)
document.addEventListener('DOMContentLoaded', () => {
    fetchAndDisplayPokemons(initialUrl);
});