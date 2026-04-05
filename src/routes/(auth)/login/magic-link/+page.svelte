<script lang="ts">
	import { goto } from '$app/navigation';
	import { trackingStore } from '$lib/Stores/tracking';
	import Loader from '$lib/Components/Loader.svelte';
	import { onMount } from 'svelte';

	const { data } = $props();

	onMount(() => {
		if (data?.user) {
			trackingStore.identifyUser(String(data.user.id), data.user.email);
		}
		goto(data?.redirectPath ?? '/dashboard');
	});
</script>

<Loader />
