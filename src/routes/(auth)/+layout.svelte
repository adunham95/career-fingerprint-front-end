<script lang="ts">
	import { PUBLIC_GTAG } from '$env/static/public';
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

<svelte:head>
	{#if PUBLIC_GTAG}
		<script async src={`https://www.googletagmanager.com/gtag/js?id=${PUBLIC_GTAG}`}></script>
		{@html `
			<script>
				window.dataLayer = window.dataLayer || [];
				function gtag(){dataLayer.push(arguments);}
				gtag('js', new Date());
				gtag('config', '${PUBLIC_GTAG}');
			</script>
		`}
	{/if}
</svelte:head>

<QueryClientProvider client={queryClient}>
	<div class=" flex h-screen w-full items-center justify-center overflow-hidden">
		{@render children()}
	</div>
</QueryClientProvider>

<style>
	:global(.login-page) {
		background-image: url('/images/pexels-pixabay-434337.jpg');
		background-size: cover;
		overflow: hidden;
		height: 100vh;
	}
	:global(.login-page html),
	:global(.login-page body) {
		overflow: hidden;
	}
</style>
