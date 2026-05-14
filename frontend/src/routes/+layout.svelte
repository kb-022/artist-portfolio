<script lang="ts">
	import './layout.css';
	import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
	let { children } = $props();
    import "../app.css";
</script>
<Header/>
{@render children()}
<Footer/>