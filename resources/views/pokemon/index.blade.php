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
                    <div class="pokemon-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" id="pokemonList">
                        <p class="text-center col-span-full">ポケモンのデータを読み込み中...</p>
                    </div>

                    <div class="pagination-buttons flex justify-center mt-6 space-x-4">
                        <button id="prevPage" class="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed" disabled>前へ</button>
                        <button id="nextPage" class="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed">次へ</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    @push('scripts')
    {{-- JavaScriptは外部ファイルに移動したので、ここでは空になります --}}
    @endpush
</x-app-layout>