<script lang="ts">
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import { trackingStore } from '$lib/Stores/tracking';
	import { onMount } from 'svelte';

	const { data } = $props();

	console.log({ data });

	onMount(() => {
		trackingStore.pageViewEvent('Verify Email', {
			verified: data.tokenDetails?.verified || false
		});
	});
</script>

<PageContainer>
	<div class="py-12">
		<div class="mx-auto max-w-2xl text-center">
			{#if data.tokenDetails?.verified}
				<h2 class="mt-2 text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
					Your email has been verified.
				</h2>
			{:else}
				<h2 class="mt-2 text-4xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
					We could not verify your email. Please try again later.
				</h2>
			{/if}

			{#if data.tokenDetails?.plan}
				<p class="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
					Below you can sign for a free trial
				</p>
			{/if}
		</div>
	</div>
	<div class="flex justify-center">
		<a
			href="/dashboard"
			class="btn btn--primary my-10 block"
			onclick={() =>
				trackingStore.trackAction('Next Step Click', {
					step: 'Go To Account'
				})}>Go to my account</a
		>
	</div>
</PageContainer>
