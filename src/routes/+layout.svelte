<script lang="ts">
	import ToastContainer from '$lib/Components/Toasts/ToastContainer.svelte';
	import { onMount } from 'svelte';
	import '../app.css';
	import '../button-variants.css';
	import '@tailwindplus/elements';

	let { children } = $props();

	let showAlphaBanner = $state(false);

	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search);
		let hideAlphaBanner = urlParams.get('hideAlphaBanner')?.toString() === 'true';
		if (hideAlphaBanner) {
			showAlphaBanner = false;
		}
	});
</script>

{#if showAlphaBanner}
	<div
		class="bg-warning-500/50 sticky top-0 z-30 w-full items-center justify-center gap-x-6 px-6 py-2.5 sm:px-3.5 print:hidden"
	>
		<p class="text-center text-sm/6 font-bold text-black">
			This is pre-release software. Expect bugs and unfinshed elements
		</p>
	</div>
{/if}

<ToastContainer />
{@render children()}
