<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('ポケモン図鑑') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    {{-- ポケモンリストを表示するコンテナ --}}
                    <div id="pokemonList" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {{-- JavaScriptがここに読み込み中メッセージやポケモンカードを挿入します --}}
                        <p class="text-center col-span-full text-gray-500 text-lg">ポケモンのデータを読み込み中...</p>
                    </div>

                    {{-- ページネーションボタン --}}
                    <div class="flex justify-center mt-10 space-x-4">
                        <button id="prevPage" class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300">
                            &lt; 前へ
                        </button>
                        <button id="nextPage" class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300">
                            次へ &gt;
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    {{-- ★★★ ここにモーダルのHTMLを追加します ★★★ --}}
    <div id="pokemonModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 hidden">
        <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
            <button id="closeModal" class="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold">&times;</button>
            <div id="modalContent" class="text-center">
                {{-- JavaScriptがここにポケモンの詳細情報を挿入します --}}
                <p class="text-gray-500">詳細データを読み込み中...</p>
            </div>
        </div>
    </div>
    {{-- ★★★ モーダルのHTML追加ここまで ★★★ --}}

    @push('scripts')
    {{-- JavaScriptは外部ファイルに移動したので、ここでは空になります --}}
    @endpush
</x-app-layout>