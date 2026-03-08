<script lang="ts">
	import { queryClient } from '$lib/API/queryClient';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { onMount } from 'svelte';
	import { trackingStore } from '$lib/Stores/tracking';

	let { children } = $props();

	onMount(() => {
		document.body.classList.add('login-page');
		window.addEventListener('beforeunload', trackingStore.flushTimeOnPage);

		return () => {
			document.body.classList.remove('login-page');
			window.removeEventListener('beforeunload', trackingStore.flushTimeOnPage);
		};
	});
</script>

<QueryClientProvider client={queryClient}>
	<div class="flex items-center justify-center md:h-screen md:w-full md:overflow-y-auto md:py-20">
		{@render children()}
	</div>
</QueryClientProvider>

<style>
	:global(.login-page) {
		background-image: url('/images/pexels-pixabay-434337.jpg');
		background-size: cover;
		/* overflow: hidden; */
		height: 100vh;
	}
	:global(.login-page html),
	:global(.login-page body) {
		/* overflow: hidden; */
	}
</style>
