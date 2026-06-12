<script lang="ts">
    import '../app.css';
    import Header from '$lib/components/Header.svelte';
    import Footer from '$lib/components/Footer.svelte';
</script>

<div class="flex min-h-screen flex-col">
    <Header />
    <main class="flex-1">
        <slot />
    </main>
    <Footer />
</div>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
    }
</style>