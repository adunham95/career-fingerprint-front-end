<script lang="ts">
	import { PUBLIC_GTAG } from '$env/static/public';
	import { queryClient } from '$lib/API/queryClient';
	import { QueryClientProvider } from '@tanstack/svelte-query';

	let { children } = $props();
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
	<div class="inset-0 flex h-screen w-screen items-center justify-center">
		<img
			src="/images/pexels-pixabay-434337.jpg"
			alt="background"
			class="absolute inset-0 -z-10 size-full object-cover object-top"
		/>
		{@render children()}
	</div>
</QueryClientProvider>
