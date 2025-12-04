<script lang="ts">
	import { useGetMyGoals } from '$lib/API/goals';
	import InfoBlock from '$lib/Components/InfoBlock.svelte';
	import Loader from '$lib/Components/Loader.svelte';

	const myGoals = useGetMyGoals({ active: true, showProgress: true, limit: 5 });
</script>

<h2 class="font-title pb-4 text-2xl">My Goals</h2>
{#if $myGoals.isLoading}
	<div class="flex justify-center">
		<Loader />
	</div>
{:else if ($myGoals.data || [])?.length > 0}
	<div class="divide-y divide-gray-200">
		{#each $myGoals.data as goal}
			<div class="px-4 py-4 sm:px-0">
				<h3>
					{goal.name}
				</h3>
				<p>Progress: {Math.trunc(goal.progress * 100)}%</p>
				<div class="my-2 flex overflow-hidden rounded-full bg-gray-200">
					<div
						style={`width: ${goal.progress * 100}%`}
						class="bg-primary-500 h-2 rounded-full"
					></div>
				</div>
				<div class="mt-2 flex gap-2"></div>
			</div>
		{/each}
	</div>
{:else}
	<InfoBlock title="Goals" description="Your goals are empty. To add a goal click add goal" />
{/if}
