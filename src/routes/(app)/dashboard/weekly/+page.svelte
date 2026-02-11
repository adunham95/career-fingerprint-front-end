<script>
	import Card from '$lib/Components/Containers/Card.svelte';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import NewAchievementForm from '$lib/Components/Forms/AchievementForm.svelte';
	import { onMount } from 'svelte';
	import { trackingStore } from '$lib/Stores/tracking.js';
	import { useGetMyGoals } from '$lib/API/goals';
	import { useFeatureGate } from '$lib/Utils/featureGate.js';

	const { data } = $props();

	const hasProFeatures = useFeatureGate(2, data.user);
	const myGoals = useGetMyGoals({ active: true, limit: 3, page: 1 }, hasProFeatures);
	const goalQuickUpdateCardPromise = hasProFeatures
		? import('$lib/Components/GoalCard/GoalQuickUpdateCard.svelte')
		: null;

	onMount(() => {
		trackingStore.pageViewEvent('Weekly Check-in Dashboard');
	});
</script>

<div class="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
	<div class="mx-auto max-w-2xl text-center lg:max-w-4xl">
		<h2 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
			What did you accomplish this week?
		</h2>
	</div>
</div>

<PageContainer>
	<div class="grid grid-cols-1 gap-4 py-2 md:grid-cols-2">
		<div>
			<Card headline="Add New Achievement">
				<NewAchievementForm id="check-in" />
				<div class="flex justify-end pt-2">
					<button
						form="check-in"
						type="submit"
						class="btn btn--primary"
						onclick={() => trackingStore.trackAction('Add Achievement Click')}
						>Add Achievement</button
					>
				</div>
			</Card>
		</div>
		<div class="space-y-4">
			<div class="flex items-end justify-between">
				<div class="relative">
					<h2 class="text-lg font-semibold text-gray-900">Goals quick update</h2>
				</div>

				<div class="flex items-center gap-2">
					<a class="text-sm font-medium text-gray-900 underline" href="/goals">View all</a>
				</div>
			</div>

			<!-- Goal mini-cards -->
			{#if hasProFeatures}
				{#if goalQuickUpdateCardPromise}
					{#await goalQuickUpdateCardPromise}
						<div class="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-600">
							Loading goals...
						</div>
					{:then GoalQuickUpdateCardModule}
						{@const GoalQuickUpdateCard = GoalQuickUpdateCardModule.default}
						<ul class="flex flex-col gap-4">
							{#each $myGoals.data as goal}
								<li class="">
									<GoalQuickUpdateCard goalItem={goal} />
								</li>
							{/each}
							{#if $myGoals.data?.length === 0}
								<li>
									<a
										href="/goals"
										class="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center transition hover:border-gray-400 hover:bg-gray-50 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-600"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke-width="1.5"
											stroke="currentColor"
											class="mx-auto size-12 text-gray-700"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0"
											/>
										</svg>

										<span class="mt-4 block text-sm font-semibold text-gray-900">
											Start your first goal
										</span>

										<span class="mt-1 block text-sm text-gray-600">
											Pick something you want to improve this quarter and we’ll help you track real
											progress.
										</span>

										<span class="btn btn--secondary mt-4 inline-flex items-center justify-center">
											Create a goal
										</span>
									</a>
								</li>
							{/if}
						</ul>
					{:catch}
						<div class="rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-700">
							Unable to load goal updates right now.
						</div>
					{/await}
				{/if}
			{:else}
				<a
					href="/settings/membership"
					class="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center transition hover:border-gray-400 hover:bg-gray-50 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-600"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="mx-auto size-12 text-gray-700"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0"
						/>
					</svg>

					<span class="mt-4 block text-sm font-semibold text-gray-900">
						Track progress toward your goals
					</span>

					<span class="mt-1 block text-sm text-gray-600">
						Set goals, break them into milestones, and link achievements as evidence.
					</span>

					<span class="mt-2 block text-xs text-gray-500">Available with Premium</span>

					<span class="btn btn--primary mt-4 inline-flex items-center justify-center">
						Unlock goals
					</span>
				</a>
			{/if}
		</div>
	</div>
</PageContainer>
