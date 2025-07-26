// DOM要素の取得 (既存の部分)
const pokemonListElement = document.getElementById('pokemonList');
const prevPageButton = document.getElementById('prevPage');
const nextPageButton = document.getElementById('nextPage');

// モーダル関連のDOM要素を取得する部分 (既存)
const pokemonModal = document.getElementById('pokemonModal');
const closeModalButton = document.getElementById('closeModal');
const modalContent = document.getElementById('modalContent');

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

        // ★ 各ポケモンの詳細データを並行して取得するためのPromise.allSettled を使用
        // これにより、個々のAPIリクエストが並行して走り、表示が速くなります。
        // ただし、APIへのリクエスト数が一気に増える点に注意。
        const pokemonDetailsPromises = data.results.map(pokemon => fetch(pokemon.url).then(res => res.json()));
        const allPokemonDetails = await Promise.allSettled(pokemonDetailsPromises);

        allPokemonDetails.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                const detailData = result.value;
                const pokemon = data.results[index]; // 元のポケモン情報を取得

                const mainType = detailData.types[0].type.name; // 最初のタイプをメインタイプとする
                const backgroundColorClass = getCardBackgroundColorClass(mainType); // 背景色クラスを取得

                // ポケモンカードのHTML要素を動的に作成
                const pokemonCard = document.createElement('div');
                // ★ bg-white を削除し、backgroundColorClass を追加
                pokemonCard.classList.add('pokemon-card', 'p-6', 'rounded-xl', 'shadow-lg', 'text-center', 'transform', 'hover:scale-105', 'transition-transform', 'duration-200', 'cursor-pointer', backgroundColorClass);

                pokemonCard.dataset.pokemonUrl = pokemon.url;

                pokemonCard.innerHTML = `
                    <img src="${detailData.sprites.front_default}" alt="${detailData.name}" class="mx-auto w-28 h-28 mb-4">
                    <h3 class="text-xl font-bold capitalize text-white">${detailData.name}</h3>
                    <p class="text-sm text-white mt-1">ID: #${String(detailData.id).padStart(3, '0')}</p>
                    <div class="mt-3 flex justify-center space-x-2">
                        ${detailData.types.map(typeInfo => `
                            <span class="px-3 py-1 text-xs font-semibold rounded-full ${getTypeColorClass(typeInfo.type.name)}">
                                ${typeInfo.type.name}
                            </span>
                        `).join('')}
                    </div>
                `;
                pokemonListElement.appendChild(pokemonCard);
            } else {
                console.error(`Failed to fetch detail for a pokemon: ${result.reason}`);
            }
        });

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

// ポケモンのタイプに応じたテキストの色クラスを返すヘルパー関数 (既存)
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

// ★★★ カードの背景色用の新しいヘルパー関数を追加 ★★★
// getCardBackgroundColorClass - カードの背景色に使うクラスを返す
function getCardBackgroundColorClass(type) {
    switch (type) {
        case 'normal': return 'bg-gray-400';
        case 'fire': return 'bg-red-600';
        case 'water': return 'bg-blue-600';
        case 'grass': return 'bg-green-600';
        case 'electric': return 'bg-yellow-500';
        case 'ice': return 'bg-blue-400';
        case 'fighting': return 'bg-orange-800';
        case 'poison': return 'bg-purple-700';
        case 'ground': return 'bg-yellow-800';
        case 'flying': return 'bg-indigo-400';
        case 'psychic': return 'bg-pink-600';
        case 'bug': return 'bg-lime-700';
        case 'rock': return 'bg-amber-800';
        case 'ghost': return 'bg-purple-900';
        case 'dragon': return 'bg-indigo-800';
        case 'steel': return 'bg-blue-gray-500';
        case 'fairy': return 'bg-pink-400';
        default: return 'bg-gray-300'; // デフォルト色
    }
}

// モーダル表示ロジック (既存)
async function displayPokemonDetails(pokemonUrl) {
    modalContent.innerHTML = '<p class="text-gray-500">詳細データを読み込み中...</p>';
    pokemonModal.classList.remove('hidden');

    try {
        const response = await fetch(pokemonUrl);
        if (!response.ok) {
            throw new Error(`HTTPエラー発生！ステータス: ${response.status} (${response.statusText})`);
        }
        const detailData = await response.json();

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

pokemonListElement.addEventListener('click', (event) => {
    const clickedCard = event.target.closest('.pokemon-card');
    if (clickedCard) {
        const pokemonUrl = clickedCard.dataset.pokemonUrl;
        if (pokemonUrl) {
            displayPokemonDetails(pokemonUrl);
        }
    }
});

closeModalButton.addEventListener('click', () => {
    pokemonModal.classList.add('hidden');
});

pokemonModal.addEventListener('click', (event) => {
    if (event.target === pokemonModal) {
        pokemonModal.classList.add('hidden');
    }
});

// ページネーションボタンのイベントリスナー (既存)
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

document.addEventListener('DOMContentLoaded', () => {
    fetchAndDisplayPokemons(initialUrl);
});