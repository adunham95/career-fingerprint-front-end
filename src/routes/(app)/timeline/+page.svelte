<script lang="ts">
	import { useMyAchievements } from '$lib/API/achievements.js';
	import { useMyEducationQuery } from '$lib/API/education.js';
	import { useMyJobPositionsQuery } from '$lib/API/job-positions.js';
	import ExpandedTimeline from '$lib/Components/Calender/ExpandedTimeline.svelte';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import NewAchievementForm from '$lib/Components/Forms/AchievementForm.svelte';
	import InfoBlock from '$lib/Components/InfoBlock.svelte';
	import Drawer from '$lib/Components/Overlays/Drawer.svelte';
	import { trackingStore } from '$lib/Stores/tracking.js';
	import { onMount } from 'svelte';
	import type { Achievement } from '../../../app.js';
	const { data } = $props();

	let jobPositionID = $state<string | null>(null);
	let educationID = $state<string | null>(null);

	let selectedAchievement = $state<Achievement | null>(null);

	let myAchievements = useMyAchievements(
		true,
		() => jobPositionID,
		() => educationID,
		data.achievements
	);
	let myJobPositions = useMyJobPositionsQuery();
	let myEducation = useMyEducationQuery();

	console.log({ data });

	let isAchievementOpen = $state(false);

	onMount(() => {
		trackingStore.pageViewEvent('Achievement Timeline');
	});
</script>

<PageContainer>
	<div
		class="align-center mt-5 mb-5 flex flex-col justify-between border-b border-gray-200 pb-5 sm:flex-row print:hidden"
	>
		<h1 class="text-2xl font-semibold text-gray-900">My Achievement Timeline</h1>
		<div class="flex justify-end">
			<button
				class="btn btn-text--primary"
				onclick={() => {
					window.print();
					trackingStore.trackAction('Print Achievement Click');
				}}>Print Timeline</button
			>
			<button
				class="btn btn--primary"
				onclick={() => {
					isAchievementOpen = true;
					trackingStore.trackAction('Add Achievement Click');
				}}>Add Achievement</button
			>
		</div>
	</div>

	<div class="print:hidden">
		<InfoBlock
			title="What is an achievement?"
			description="An achievement is anything you accomplish, big or small, that you document for future use in performance reviews, 1:1 meetings, job interviews, building your resume or reviewing your professional growth."
		/>
	</div>

	<div class="pb-5 print:hidden">
		<div class="flex items-center justify-end">
			<el-dropdown class="relative inline-block text-left">
				<button
					class="group relative inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900"
				>
					{#if jobPositionID !== null}
						{@const job = ($myJobPositions.data || []).find((j) => j.id == jobPositionID)}
						{job?.name || 'Job'} || {job?.company}
					{:else}
						Select A Job
					{/if}
					<svg
						viewBox="0 0 20 20"
						fill="currentColor"
						data-slot="icon"
						aria-hidden="true"
						class="-mr-1 ml-1 size-5 shrink-0 text-gray-400 group-hover:text-gray-500"
					>
						<path
							d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
							clip-rule="evenodd"
							fill-rule="evenodd"
						/>
					</svg>
				</button>

				<el-menu
					anchor="bottom start"
					popover
					class="w-40 origin-top-left rounded-md bg-white shadow-2xl ring-1 ring-black/5 transition transition-discrete [--anchor-gap:--spacing(2)] focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
				>
					<div class="py-1">
						{#each $myJobPositions.data || [] as jobPosition}
							<button
								onclick={() => {
									jobPositionID = jobPosition.id;
									educationID = null;
									$myAchievements.refetch();
								}}
								class={`block w-full px-4 py-2 text-start text-base font-medium text-gray-900 focus:bg-gray-100 focus:outline-hidden ${jobPositionID === jobPosition.id ? 'bg-primary ' : ''} `}
							>
								<p>
									{jobPosition.name}
								</p>
								<p class="text-xs text-gray-600">
									{jobPosition.company}
								</p>
							</button>
						{/each}
					</div>
				</el-menu>
			</el-dropdown>

			<el-dropdown class="relative ml-2 inline-block text-left">
				<button
					class="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900"
				>
					{#if educationID !== null}
						{@const edu = ($myEducation.data || []).find((j) => j.id == educationID)}
						{edu?.institution || 'Education'}
					{:else}
						Select Education
					{/if}
					<svg
						viewBox="0 0 20 20"
						fill="currentColor"
						data-slot="icon"
						aria-hidden="true"
						class="-mr-1 ml-1 size-5 shrink-0 text-gray-400 group-hover:text-gray-500"
					>
						<path
							d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
							clip-rule="evenodd"
							fill-rule="evenodd"
						/>
					</svg>
				</button>

				<el-menu
					anchor="bottom start"
					popover
					class="w-40 origin-top-left rounded-md bg-white shadow-2xl ring-1 ring-black/5 transition transition-discrete [--anchor-gap:--spacing(2)] focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
				>
					<div class="py-1">
						{#each $myEducation.data || [] as edu}
							<button
								onclick={() => {
									jobPositionID = null;
									educationID = edu.id;
									$myAchievements.refetch();
								}}
								class={`block w-full px-4 py-2 text-start text-base font-medium text-gray-900 focus:bg-gray-100 focus:outline-hidden ${educationID === edu.id ? 'bg-primary ' : ''} `}
							>
								<p>
									{edu.institution}
								</p>
								<p class="text-xs text-gray-600">
									{edu.degree}
								</p>
							</button>
						{/each}
					</div>
				</el-menu>
			</el-dropdown>

			<button
				class="btn btn-text--primary ml-2"
				onclick={() => {
					jobPositionID = null;
					educationID = null;
					$myAchievements.refetch();
				}}
				>Reset
			</button>
		</div>
	</div>

	<div class="grid grid-cols-1 gap-1 md:grid-cols-2">
		<!-- Uncomment to add edit achievement functionality -->
		<ExpandedTimeline
			dates={$myAchievements.data || []}
			onActionClick={(a) => {
				selectedAchievement = a;
				isAchievementOpen = true;
			}}
		/>
	</div>
</PageContainer>

<Drawer
	bind:isOpen={isAchievementOpen}
	title="Add Achievement"
	subTitle="Add an a achievement here"
	saveFormID="newAchievement"
	onClose={() => {
		selectedAchievement = null;
	}}
>
	<NewAchievementForm
		id="newAchievement"
		achievement={selectedAchievement}
		onSuccess={() => {
			isAchievementOpen = false;
			selectedAchievement = null;
		}}
	/>
</Drawer>
