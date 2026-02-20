<script lang="ts">
	import { PUBLIC_MIXPANEL_TOKEN, PUBLIC_GTM_ID } from '$env/static/public';
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

<svelte:head>
	{#if PUBLIC_GTM_ID}
		{@html `
		<script>
			(function (w, d, s, l, i) {
				w[l] = w[l] || [];
				w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
				var f = d.getElementsByTagName(s)[0],
				j = d.createElement(s),
				dl = l != 'dataLayer' ? '&l=' + l : '';
				j.async = true;
				j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
				f.parentNode.insertBefore(j, f);
				})(window, document, 'script', 'dataLayer', '${PUBLIC_GTM_ID}');
				</script>
				<!-- End Google Tag Manager -->
				`}
	{/if}
</svelte:head>

<QueryClientProvider client={queryClient}>
	<SvelteQueryDevtools buttonPosition="bottom-left" />
	<ToastContainer />
	{@render children()}
</QueryClientProvider>

{#if PUBLIC_GTM_ID}
	<!-- Google Tag Manager (noscript) -->
	<noscript
		><iframe
			src={`https://www.googletagmanager.com/ns.html?id=${PUBLIC_GTM_ID}`}
			height="0"
			width="0"
			style="display:none;visibility:hidden"
		></iframe></noscript
	>
	<!-- End Google Tag Manager (noscript) -->
{/if}
