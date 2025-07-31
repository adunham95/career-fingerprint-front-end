<script lang="ts">
	import ToastContainer from '$lib/Components/Toasts/ToastContainer.svelte';
	import '../app.css';
	import '../button-variants.css';
	import '@tailwindplus/elements';

	let { children } = $props();
</script>

<ToastContainer />
{@render children()}
