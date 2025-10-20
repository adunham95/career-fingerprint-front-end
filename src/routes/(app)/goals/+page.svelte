<script>
	import Card from '$lib/Components/Containers/Card.svelte';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import RadioButtons from '$lib/Components/FormElements/RadioButtons.svelte';
	import TextInput from '$lib/Components/FormElements/TextInput.svelte';

	let templates = [
		{
			id: 'goal_public_speaking',
			title: 'Improve Public Speaking',
			description: 'Improve my public speaking confidence.',
			type: 'achievement_only',
			targetAchievements: 5
		},
		{
			id: 'goal_networking',
			title: 'Strengthen Networking Skills',
			description: 'Build stronger professional connections.',
			type: 'achievement_only',
			targetAchievements: 6
		},
		{
			id: 'goal_senior_pm',
			title: 'Get Promoted to Senior PM',
			description: 'Earn promotion to Senior Product Manager.',
			type: 'milestone_based',
			milestones: [
				{
					title: 'Lead Key Projects',
					targetAchievements: 2
				},
				{
					title: 'Mentor Junior PMs',
					targetAchievements: 2
				},
				{
					title: 'Show Strategic Impact',
					targetAchievements: 3
				},
				{
					title: 'Manager Endorsement',
					targetAchievements: 1
				}
			]
		},
		{
			id: 'goal_leadership_presence',
			title: 'Build Leadership Presence',
			description: 'Develop my leadership reputation at work.',
			type: 'milestone_based',
			milestones: [
				{
					title: 'Improve Team Communication',
					targetAchievements: 2
				},
				{
					title: 'Drive Initiatives',
					targetAchievements: 2
				},
				{
					title: 'Support Team Growth',
					targetAchievements: 2
				}
			]
		}
	];

	let hasTyped = $state(false);
</script>

<RadioButtons />

<PageContainer className="py-2">
	<div class="flex justify-center">
		<Card className="w-full max-w-2xl">
			<textarea
				placeholder="I want to..."
				class="w-full rounded border-0 py-2"
				rows={hasTyped ? 2 : 1}
				oninput={(e) => {
					if (e.currentTarget.value.length > 0 && hasTyped !== true) {
						hasTyped = true;
					}
				}}
			></textarea>
			{#if hasTyped}
				<div>
					<p>Add Milestones</p>
					<ul>
						<li class="flex gap-2">
							<TextInput
								id="milestone-name"
								placeholder="Milestone Name"
								label="Milestone Name"
								className="w-full"
							/>
							<TextInput id="achievementCount" label="Count" />
							<div class="flex items-end justify-end">
								<button class="btn btn-outline--error">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="currentColor"
										class="size-5"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
										/>
									</svg>

									<span class="sr-only">Delete</span>
								</button>
							</div>
						</li>
					</ul>
					<button class="btn btn-outline--primary mt-2">Add Milestone</button>
				</div>
			{/if}
		</Card>
	</div>
	<div class="flex justify-center py-3">
		<p class="mt-0.5 text-sm text-gray-500">Or Use a Template</p>
	</div>
	<ul class="mt-2 grid grid-cols-4 gap-4">
		{#each templates as template}
			<li class="flow-root">
				<div
					class="focus-within:outline-primary relative flex items-center space-x-4 rounded-xl px-3 py-2 ring-3 ring-gray-900/20 focus-within:outline-2 hover:bg-gray-900/4 sm:rounded-xl"
				>
					<div>
						<h3 class="text-sm font-medium text-gray-900">
							<button class="focus:outline-hidden">
								<span aria-hidden="true" class="absolute inset-0"></span>
								<span>{template.title}</span>
							</button>
						</h3>
						<p class="mt-1 text-sm text-gray-500">{template.description}</p>
					</div>
				</div>
			</li>
		{/each}
	</ul>
	<div class="my-4">
		<Card headline="Get Promoted to Senior PM">
			<div class="my-2 flex overflow-hidden rounded-full bg-gray-200">
				<div style="width: 10%" class="bg-primary-300 h-2 rounded-full"></div>
				<div style="width: 50%" class="bg-primary-500 h-2 rounded-full"></div>
				<div style="width: 12%" class="bg-primary-700 h-2 rounded-full"></div>
			</div>
			<div class="mt-2 flex gap-2">
				<div class="w-full rounded border-2 border-gray-800/12 p-1">
					<p class="pb-2">Lead Key Projects</p>
					<div class="overflow-hidden rounded-full bg-gray-200">
						<div
							style="width: calc((0 * 2 + 1) / 8 * 100%)"
							class="bg-primary h-2 rounded-full"
						></div>
					</div>
				</div>
				<div class="w-full rounded border-2 border-gray-800/12 p-1">
					<p class="pb-2">Mentor Junior PMs</p>
					<div class="overflow-hidden rounded-full bg-gray-200">
						<div
							style="width: calc((0 * 2 + 1) / 8 * 100%)"
							class="bg-primary h-2 rounded-full"
						></div>
					</div>
				</div>
				<div class="w-full">
					<p class="pb-2">Show Strategic Impact</p>
					<div class="overflow-hidden rounded-full bg-gray-200">
						<div
							style="width: calc((0 * 2 + 1) / 8 * 100%)"
							class="bg-primary h-2 rounded-full"
						></div>
					</div>
					<p>Recent Achievement</p>
					<div>
						<span>Facilitated a cross-team project kickoff</span>
					</div>
				</div>
			</div>
		</Card>
	</div>
</PageContainer>
