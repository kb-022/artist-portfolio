<script>
    import { PUBLIC_API_URL } from '$env/static/public';
    let { data } = $props();
</script>

<h1>Traditional Works</h1>

<div class="grid">
    {#each data.works as work}
        <div class="card">
            <img src={`${PUBLIC_API_URL}${work.image}`} alt={work.title} />
            <h2>{work.title}</h2>
            <p>{work.medium}</p>
        </div>
    {/each}
</div>

<style>
    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
    }

    .card img {
        width: 100%;
        height: auto;
        display: block;
    }
</style>