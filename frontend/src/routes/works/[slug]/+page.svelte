<script lang="ts">
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
    const { artwork } = data;
</script>

<div class="mx-auto max-w-7xl px-4 py-12">
    <div class="grid grid-cols-1 gap-12 md:grid-cols-3">
        <!-- Image - takes up 1.5 columns worth of space -->
        <div class="md:col-span-1">
            {#if artwork.image}
                <img
                        src={artwork.image}
                        alt={artwork.title}
                        class="w-full rounded-lg object-cover shadow-md"
                />
            {/if}
        </div>

        <!-- Details - takes up 1.5 columns worth of space -->
        <div class="md:col-span-2">
            <h1 class="mb-6 text-4xl font-bold text-gray-900">{artwork.title}</h1>

            {#if artwork.art_type==="traditional"}
                <p class="mb-3 text-lg text-gray-700">
                    <span class="font-semibold">Medium:</span> {artwork.collection_medium_name}
                </p>
            {/if}

            {#if artwork.art_type==="digital"}
                <p class="mb-3 text-lg text-gray-700">
                    <span class="font-semibold">Collection:</span> {artwork.collection_medium_name}
                </p>
            {/if}

            {#if artwork.year}
                <p class="mb-6 text-lg text-gray-700">
                    <span class="font-semibold">Year:</span> {artwork.year}
                </p>
            {/if}

            {#if artwork.description}
                <p class="mb-6 text-gray-700">{artwork.description}</p>
            {/if}
        </div>
    </div>
</div>