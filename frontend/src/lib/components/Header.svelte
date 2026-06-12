<script lang="ts">
    import logo from '$lib/assets/meeeee.avif';
</script>

<nav class="sticky top-0 z-20 w-full border-b border-default bg-white">
    <div class="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
        <a href="/" class="flex items-center space-x-3 rtl:space-x-reverse">
            <img src={logo} class="h-7" alt="logo" />
            <span class="self-center whitespace-nowrap text-xl font-semibold text-heading">Chris Asmer</span>
        </a>
        <button data-collapse-toggle="navbar-default" type="button" class="inline-flex items-center justify-center rounded-base p-2 text-sm text-body hover:bg-neutral-secondary md:hidden">
            <span class="sr-only">Open main menu</span>
            <svg class="h-6 w-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
        <div class="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul class="flex flex-col rounded-base border border-default bg-neutral-secondary-soft p-4 font-medium md:flex-row md:space-x-8 md:border-0 md:bg-transparent md:p-0 rtl:space-x-reverse">
                <li>
                    <a href="/about" class="block rounded px-3 py-2 text-heading hover:bg-neutral-tertiary md:hover:bg-transparent md:p-0 md:hover:text-fg-brand">About</a>
                </li>
                <li>
                    <a href="/digital" class="block rounded px-3 py-2 text-heading hover:bg-neutral-tertiary md:hover:bg-transparent md:p-0 md:hover:text-fg-brand">Digital</a>
                </li>
                <li>
                    <a href="/traditional" class="block rounded px-3 py-2 text-heading hover:bg-neutral-tertiary md:hover:bg-transparent md:p-0 md:hover:text-fg-brand">Traditional</a>
                </li>
                <li>
                    <a href="/contact" class="block rounded px-3 py-2 text-heading hover:bg-neutral-tertiary md:hover:bg-transparent md:p-0 md:hover:text-fg-brand">Contact</a>
                </li>
            </ul>
        </div>
    </div>
</nav>