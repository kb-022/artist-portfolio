<script lang="ts">
    import ArtGrid from '$lib/components/ArtGrid.svelte';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();

    let selectedMedium = $state<string | null>(null);

    let filteredArtworks = $derived(selectedMedium
        ? data.artworks.filter(art => art.medium === selectedMedium)
        : data.artworks);
</script>

<div class="mx-auto max-w-7xl px-4 py-12">
    <div class="mb-12">
        <h1 class="mb-4 text-5xl font-bold text-gray-900">Traditional Works</h1>
        <p class="max-w-2xl text-lg text-gray-600">
            Explore my collection of traditional artworks created with various mediums including oil on canvas, watercolor, and more.
        </p>
    </div>

    <!-- Filter Box -->
    <div class="mb-8">
        <div class="flex flex-wrap items-center gap-3">
            <span class="text-sm font-semibold text-gray-700">Filter by Medium:</span>
            <button
                    onclick={() => selectedMedium = null}
                    class={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
					selectedMedium === null
						? 'bg-gray-900 text-white'
						: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
				}`}
            >
                All ({data.artworks.length})
            </button>
            {#each data.mediums as medium}
                <button
                        onclick={() => selectedMedium = medium.name}
                        class={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
						selectedMedium === medium.name
							? 'bg-gray-900 text-white'
							: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
					}`}
                >
                    {medium.name} ({data.artworks.filter(a => a.medium === medium.name).length})
                </button>
            {/each}
        </div>
    </div>

    <ArtGrid artworks={filteredArtworks} />
</div>