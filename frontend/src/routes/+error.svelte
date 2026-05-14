<script>
    import fih from '$lib/assets/glowingfih.avif'
</script>

<section class="relative  bg-slate-900">
    <img
            src="{fih}"
            alt="Hero background"
            class="absolute inset-0  object-cover"
    />

    <div
            class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"
    ></div>

    <div class="relative z-10 flex h-full min-h-screen justify-center px-8 md:px-24">
        <div class="max-w-2xl text-white">
            <h1 class="text-5xl font-bold tracking-tight md:text-7xl">
                404
            </h1>
            <p class="mt-6 text-lg text-slate-200 md:text-xl">
                Page not Found
            </p>

        </div>
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
            Button
        </button>
    </div>
</section>