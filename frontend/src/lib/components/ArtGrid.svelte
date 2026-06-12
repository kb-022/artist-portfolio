<script lang="ts">
    import { goto } from '$app/navigation';
    import type { Art } from '$lib/types';

    interface Props {
        artworks: Art[];
        loading?: boolean;
    }

    let { artworks, loading = false }: Props = $props();

    function handleClick(slug: string) {
        goto(`/works/${slug}`);
    }
</script>

{#if loading}
    <div class="flex items-center justify-center py-12">
        <div class="text-lg text-gray-500">Loading artworks...</div>
    </div>
{:else if artworks.length === 0}
    <div class="flex items-center justify-center py-12">
        <div class="text-lg text-gray-500">No artworks found.</div>
    </div>
{:else}
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {#each artworks as artwork (artwork.slug)}
            <button
                    type="button"
                    onclick={() => handleClick(artwork.slug)}
                    class="group cursor-pointer overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:ring-2 hover:ring-gray-300"
            >
                <div class="aspect-square overflow-hidden bg-gray-100">
                    {#if artwork.image}
                        <img
                                src={artwork.image}
                                alt={artwork.title}
                                class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                loading="lazy"
                        />
                    {/if}
                </div>
                <div class="bg-white p-4">
                    <h3 class="truncate text-sm font-semibold text-gray-900">{artwork.title}</h3>
                    {#if artwork.medium}
                        <p class="mt-1 text-xs text-gray-600">{artwork.medium}</p>
                    {/if}
                    {#if artwork.description}
                        <p class="mt-2 line-clamp-2 text-xs text-gray-700">{artwork.description}</p>
                    {/if}
                </div>
            </button>
        {/each}
    </div>
{/if}