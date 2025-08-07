<script>
	import { page } from '$app/state';
	import { trackingStore } from '$lib/Stores/tracking';
	import { onMount } from 'svelte';

	onMount(() => {
		trackingStore.pageViewEvent('404', { page: page.url.href });
	});
</script>

<main class="relative isolate flex h-screen items-center justify-center overflow-hidden">
	<img
		src="/images/pexels-seven11nash-380768.jpg"
		alt=""
		class="absolute inset-0 -z-10 size-full object-cover object-top"
	/>
	<div class=" mx-2 rounded-md bg-white/30 p-6 text-center backdrop-blur-md">
		<p class="text-primary text-base/8 font-semibold">{page.status}</p>
		<h1 class="text-secondary mt-4 text-5xl font-semibold tracking-tight text-balance sm:text-7xl">
			{page?.error?.message}
		</h1>
		<div class="mt-10 flex justify-center">
			<a href="/" class="text-primary-400 text-sm/7 font-semibold"
				><span aria-hidden="true">&larr;</span> Back to home</a
			>
		</div>
	</div>
</main>
