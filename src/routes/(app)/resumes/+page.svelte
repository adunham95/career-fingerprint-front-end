<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_API_URL } from '$env/static/public';
	import Card from '$lib/Components/Containers/Card.svelte';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import FeatureBlock from '$lib/Components/FeatureBlock.svelte';
	import FeatureLocked from '$lib/Components/FeatureLocked.svelte';
	import PremiumBadge from '$lib/Components/PremiumBadge.svelte';
	import { trackingStore } from '$lib/Stores/tracking.js';
	import { useFeatureGate } from '$lib/Utils/featureGate.js';
	import { getMonthName } from '$lib/Utils/formatDate';
	import { onMount } from 'svelte';

	const { data } = $props();

	onMount(() => {
		trackingStore.pageViewEvent('Resumes');
	});

	console.log(data);

	let isLoading = $state(false);
	const featureEnabled = useFeatureGate(1, data.user);

	async function createNewResume(e: Event) {
		e.preventDefault();
		isLoading = true;
		const url = `${PUBLIC_API_URL}/resume`;

		const res = await fetch(url, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json' // Set content type to JSON
			}
		});

		if (res.ok) {
			const newResume = await res.json();
			goto(`/resumes/${newResume.id}`);
			isLoading = false;
		}
	}
</script>

<PageContainer className="py-2">
	{#if featureEnabled}
		<ul role="list" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
			<li class="aspect-square">
				<button
					type="button"
					class="relative block w-full cursor-pointer rounded-lg border-3 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden"
					disabled={isLoading}
					onclick={(e) => {
						createNewResume(e);
						trackingStore.trackAction('Create a new resume');
					}}
				>
					<PremiumBadge />
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="mx-auto size-12 text-gray-400"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
						/>
					</svg>

					<span class="mt-2 block text-sm font-semibold text-gray-900">Create a new resume</span>
				</button>
			</li>
			{#each data.resumes || [] as resume}
				{@const date = new Date(resume.updatedAt)}
				<li class=" aspect-square">
					<a
						href={`/resumes/${resume.id}`}
						onclick={() => trackingStore.trackAction('View My Resume')}
					>
						<Card className="h-full">
							<p>{resume.name}</p>
							<p class="text-xs text-gray-400">
								Last Edited {getMonthName(date.getMonth())}
								{date.getFullYear()}
							</p>
						</Card>
					</a>
				</li>
			{/each}
		</ul>
	{:else}
		<ul role="list" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
			<li class="aspect-square">
				<a
					href="/settings/membership"
					onclick={() => {
						trackingStore.trackAction(actionName, { unlockPremium: 'true' });
					}}
					class="relative block w-full cursor-pointer rounded-lg border-3 border-dashed border-gray-600/30 bg-gray-600/10 p-12 text-center focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 focus:outline-hidden"
					disabled
				>
					<FeatureLocked />
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="mx-auto size-12 text-gray-400"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
						/>
					</svg>

					<span class="mt-2 block text-sm font-semibold text-gray-900"
						>Create resumes with a premium account</span
					>
				</a>
			</li>
		</ul>
	{/if}
</PageContainer>
