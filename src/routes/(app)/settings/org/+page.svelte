<script lang="ts">
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import { trackingStore } from '$lib/Stores/tracking';
	import { onMount } from 'svelte';
	import NewOrg from './newOrg.svelte';

	const { data } = $props();

	onMount(async () => {
		trackingStore.pageViewEvent('New Org Settings');
	});
</script>

<PageContainer className="divide-y divide-gray-300">
	{#if data.user.orgs.length > 0}
		<ul
			role="list"
			class="my-4 divide-y divide-gray-100 overflow-hidden bg-white shadow-xs outline-1 outline-gray-900/5 sm:rounded-xl"
		>
			{#each data.user.orgs as org}
				<li class="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6">
					<div class="flex min-w-0 gap-x-4">
						{#if org.logoURL}
							<img src={org.logoURL} alt="" class="size-12 flex-none rounded-full bg-gray-50" />
						{:else}
							<div
								class="flex size-12 flex-none items-center justify-center overflow-hidden rounded-full bg-gray-50"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="size-8"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
									/>
								</svg>
							</div>
						{/if}
						<div class="min-w-0 flex-auto">
							<p class="text-sm/6 font-semibold text-gray-900">
								<a href={`/org/${org.id}`}>
									<span class="absolute inset-x-0 -top-px bottom-0"></span>
									{org.name}
								</a>
							</p>
						</div>
					</div>
					<div class="flex shrink-0 items-center gap-x-4">
						<div class="hidden sm:flex sm:flex-col sm:items-end">
							<p class="text-sm/6 text-gray-900">Go to Org</p>
						</div>
						<svg
							viewBox="0 0 20 20"
							fill="currentColor"
							data-slot="icon"
							aria-hidden="true"
							class="size-5 flex-none text-gray-400"
						>
							<path
								d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
								clip-rule="evenodd"
								fill-rule="evenodd"
							/>
						</svg>
					</div>
				</li>
			{/each}
		</ul>
	{:else}
		<NewOrg userID={data.user.id} />
	{/if}
</PageContainer>
