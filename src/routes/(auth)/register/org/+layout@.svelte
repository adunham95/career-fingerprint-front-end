<script lang="ts">
	import { queryClient } from '$lib/API/queryClient';
	import { QueryClientProvider } from '@tanstack/svelte-query';

	let { children } = $props();
</script>

<QueryClientProvider client={queryClient}>
	<div class="inset-0 hidden h-screen w-screen items-center justify-center md:flex">
		<img
			src="/images/pexels-pixabay-434337.jpg"
			alt="background"
			class="absolute inset-0 -z-10 size-full object-cover object-top"
		/>
		{@render children()}
	</div>
	<div class="md:hidden">
		{@render children()}
	</div>
</QueryClientProvider>
