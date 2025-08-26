<script lang="ts">
	import { trackingStore } from '$lib/Stores/tracking';
	import { onMount } from 'svelte';

	onMount(() => {
		trackingStore.pageViewEvent('Thank You Org Subscription');
	});
</script>
