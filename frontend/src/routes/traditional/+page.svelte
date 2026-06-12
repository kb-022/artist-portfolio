<script lang="ts">
    import ArtGrid from '$lib/components/ArtGrid.svelte';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
</script>

<div class="mx-auto max-w-7xl px-4 py-12">
    <h1 class="mb-8 text-4xl font-bold text-gray-900">Traditional Works</h1>
    <ArtGrid artworks={data.artworks} />
</div>