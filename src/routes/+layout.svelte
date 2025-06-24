<script lang="ts">
	import ToastContainer from '$lib/Components/Toasts/ToastContainer.svelte';
	import '../app.css';
	import '../button-variants.css';

	let { children } = $props();
</script>

<ToastContainer />
{@render children()}
