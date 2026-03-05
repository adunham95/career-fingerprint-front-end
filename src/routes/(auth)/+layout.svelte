<script lang="ts">
	import { queryClient } from '$lib/API/queryClient';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		document.body.classList.add('login-page');

		return () => {
			document.body.classList.remove('login-page');
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
