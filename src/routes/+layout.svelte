<script lang="ts">
	import { PUBLIC_MIXPANEL_TOKEN } from '$env/static/public';
	import mixpanel from 'mixpanel-browser';
	import ToastContainer from '$lib/Components/Toasts/ToastContainer.svelte';
	import '../app.css';
	import '../button-variants.css';
	import '@tailwindplus/elements';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { queryClient } from '$lib/API/queryClient';
	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';

	let { children } = $props();
	mixpanel.init(PUBLIC_MIXPANEL_TOKEN, { debug: false, track_pageview: false });
</script>

<QueryClientProvider client={queryClient}>
	<SvelteQueryDevtools buttonPosition="bottom-left" />
	<ToastContainer />
	{@render children()}
</QueryClientProvider>
