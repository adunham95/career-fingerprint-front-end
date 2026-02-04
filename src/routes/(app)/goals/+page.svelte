<script lang="ts">
	import { useGetMyGoals } from '$lib/API/goals';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import GoalForm from '$lib/Components/Forms/GoalForm.svelte';
	import GoalCard from '$lib/Components/GoalCard/GoalCard.svelte';
	import Drawer from '$lib/Components/Overlays/Drawer.svelte';
	import { onMount } from 'svelte';
	import templates from './templates.json';
	import { trackingStore } from '$lib/Stores/tracking';

	interface Template {
		templateKey: string;
		title: string;
		description: string;
		milestones: {
			type: string;
			title: string;
			keywords: string[];
			targetCount: number;
			streak: number;
			checklist: string[];
		}[];
	}

	let showGoalDrawer = $state(false);

	let selectedTemplate = $state<Template | null>(null);

	const myGoals = useGetMyGoals({ active: true });

	onMount(() => {
		trackingStore.pageViewEvent('Goals');
	});
</script>

<div class="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-16 lg:px-8">
	<div class="mx-auto max-w-2xl text-center lg:max-w-4xl">
		<h2 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Goals</h2>
		<p>Track your goals or start a new one with a template</p>
	</div>
</div>

<PageContainer>
	<p>Templates</p>
	<div class="auto-fit-250 grid gap-2 py-2">
		{#each templates as temp}
			<div
				class="group hover:outline-primary focus:outline-primary relative flex cursor-pointer flex-col justify-start rounded-lg border border-gray-300 p-4 hover:outline-2 focus:outline-2"
			>
				<p class="text-start text-base font-medium text-gray-900">{temp.title}</p>
				{#if temp.description}
					<p class="mt-1 text-start text-sm text-gray-500">{temp.description}</p>
				{/if}
				<ul class="mt-1 list-inside list-disc text-start text-sm text-gray-500">
					{#each temp.milestones as step}
						<li>{step.title}</li>
					{/each}
				</ul>
				<div class="flex-1"></div>
				<div class="mt-2">
					<button
						class="btn btn-text--secondary btn-small"
						onclick={() => {
							selectedTemplate = temp as Template;
							showGoalDrawer = true;
							trackingStore.trackAction('Template Click', {
								template: temp.title,
								templateKey: temp.templateKey
							});
						}}
					>
						Use Template <span class="absolute inset-x-0 -top-px bottom-0"></span>
					</button>
				</div>
			</div>
		{/each}
	</div>
	<div class="flex justify-end">
		<div class="mt-6 flex-row items-center justify-center gap-3 text-sm text-slate-500">
			<span>Didn’t find a template that fits?</span>

			<button
				type="button"
				onclick={() => {
					selectedTemplate = null;
					showGoalDrawer = true;
					trackingStore.trackAction('Custom Template Click');
				}}
				class="rounded-md border border-slate-300 px-3 py-1.5 font-medium text-slate-600
            transition hover:border-slate-400
            hover:text-slate-800 focus:ring-2 focus:ring-slate-300 focus:ring-offset-2
            focus:outline-none"
			>
				Create a custom goal
			</button>
		</div>
	</div>
	<p>In Progress</p>
	<ul role="list" class="auto-fit-500 grid gap-6 py-4">
		{#each $myGoals.data as goal}
			<li class="">
				<GoalCard goalItem={goal} />
			</li>
		{/each}
	</ul>
	<!-- <p>Completed</p>
	<div class="auto-fit-250 grid">
		<div></div>
	</div> -->
</PageContainer>

<Drawer
	title="Create Goal"
	bind:isOpen={showGoalDrawer}
	width="max-w-xl w-full"
	saveFormID="newGoal"
>
	<GoalForm
		template={selectedTemplate}
		onSuccess={() => {
			showGoalDrawer = false;
		}}
	/>
</Drawer>
