<script lang="ts">
	import { useAchievementTags, useMyAchievements } from '$lib/API/achievements.js';
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
	import Select from '$lib/Components/FormElements/Select.svelte';
	import DateInputV2 from '$lib/Components/FormElements/DateInputV2.svelte';
	import Loader from '$lib/Components/Loader.svelte';
	import { PUBLIC_API_URL } from '$env/static/public';
	import PremiumBadge from '$lib/Components/PremiumBadge.svelte';
	import { useFeatureGate } from '$lib/Utils/featureGate.js';
	const { data } = $props();

	let jobPositionID = $state<string | null>(null);
	let educationID = $state<string | null>(null);
	let selectedTag = $state<string | null>(null);
	let startDate = $state<string | null>(null);
	let endDate = $state<string | null>(null);

	let selectedAchievement = $state<Achievement | null>(null);

	const getJob = () => jobPositionID;
	const getEdu = () => educationID;
	const getTag = () => selectedTag;
	const getStart = () => startDate;
	const getEnd = () => endDate;

	let myAchievements = useMyAchievements(
		data.achievements,
		true,
		getJob,
		getEdu,
		getTag,
		getStart,
		getEnd
	);
	let myJobPositions = useMyJobPositionsQuery();
	let myEducation = useMyEducationQuery();
	let myAchTags = useAchievementTags();

	let isAchievementOpen = $state(false);
	let isMobileFiltersOpen = $state(false);

	onMount(() => {
		trackingStore.pageViewEvent('Achievement Timeline');
	});
</script>

<PageContainer>
	<div
		class="align-center mt-5 mb-5 flex flex-col justify-between border-b border-gray-200 pb-5 sm:flex-row print:hidden"
	>
		<h1 class="text-2xl font-semibold text-gray-900">My Achievement Timeline</h1>
		{#if useFeatureGate(1, data.user)}
			<div class="flex justify-end">
				<button
					class="btn btn-text--primary"
					onclick={() => {
						window.print();
						trackingStore.trackAction('Print Achievement Click');
					}}
					><svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z"
						/>
					</svg>
					<span class="sr-only">Print Timeline</span>
				</button>
				{#if useFeatureGate(1, data.user)}
					<a
						class="btn btn-text--primary relative mr-4 ml-2 flex justify-center"
						target="_blank"
						download
						href={`${PUBLIC_API_URL}/achievement/my/pdf`}
						onclick={() => trackingStore.trackAction('Download Cheatsheet')}
						><svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="size-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
							/>
						</svg>
						<span class="sr-only">Download Timeline</span>

						<PremiumBadge />
					</a>
				{:else}
					<div class="btn btn-text--disabled relative mr-4 ml-2 cursor-not-allowed opacity-25">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="size-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
							/>
						</svg>
						<PremiumBadge />
						<span class="sr-only">Download Timeline</span>
					</div>
				{/if}

				<button
					class="btn btn--primary"
					onclick={() => {
						isAchievementOpen = true;
						trackingStore.trackAction('Add Achievement Click');
					}}>Add Achievement</button
				>
			</div>
		{/if}
	</div>

	<div class="print:hidden">
		<InfoBlock
			title="What is an achievement?"
			description="An achievement is anything you accomplish, big or small, that you document for future use in performance reviews, 1:1 meetings, job interviews, building your resume or reviewing your professional growth."
		/>
	</div>

	<div class="pb-5 print:hidden">
		<div class="flex items-center justify-end md:hidden">
			<button class="btn btn-text--primary" onclick={() => (isMobileFiltersOpen = true)}
				>Show Filters</button
			>
		</div>
		<div class="hidden items-center justify-end md:flex">
			<div class="relative">
				<button
					popovertarget="desktop-menu-solutions"
					class="group relative ml-2 inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900"
				>
					Date Range
					<svg
						viewBox="0 0 20 20"
						fill="currentColor"
						data-slot="icon"
						aria-hidden="true"
						class="size-5"
					>
						<path
							d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
							clip-rule="evenodd"
							fill-rule="evenodd"
						/>
					</svg>
				</button>

				<el-popover
					id="desktop-menu-solutions"
					anchor="bottom"
					popover
					class="w-screen max-w-max overflow-visible bg-transparent px-4 transition transition-discrete [--anchor-gap:--spacing(5)] backdrop:bg-transparent open:flex data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
				>
					<div
						class="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white p-4 text-sm/6 shadow-lg outline-1 outline-gray-900/5"
					>
						<DateInputV2 showDate value={startDate} onChange={(v) => (startDate = v)} />
						<DateInputV2 showDate value={endDate} onChange={(v) => (endDate = v)} />
						<div class="flex justify-end py-2">
							<button
								class="btn btn-small btn-text--primary mr-2"
								onclick={() => {
									startDate = null;
									endDate = null;
									$myAchievements.refetch();
								}}>Clear</button
							>
							<button
								class="btn btn-small btn--primary"
								onclick={() => {
									$myAchievements.refetch();
								}}>Load</button
							>
						</div>
					</div>
				</el-popover>
			</div>
			<el-dropdown class="relative inline-block text-left">
				<button
					class="group relative ml-2 inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900"
				>
					{#if selectedTag !== null}
						{@const category = ($myAchTags.data || []).find((j) => j.id == selectedTag)}
						{category?.name || 'Category'}
					{:else}
						Select A Category
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
						{#each $myAchTags.data || [] as ach}
							<button
								onclick={() => {
									selectedTag = ach.id || null;
									educationID = null;
									selectedAchievement = null;
									$myAchievements.refetch();
								}}
								class={`block w-full px-4 py-2 text-start text-base font-medium text-gray-900 focus:bg-gray-100 focus:outline-hidden ${selectedTag === ach.id ? 'bg-primary ' : ''} `}
							>
								<p>
									{ach.name}
								</p>
							</button>
						{/each}
					</div>
				</el-menu>
			</el-dropdown>

			<el-dropdown class="relative ml-2 inline-block text-left">
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
									selectedTag = null;
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
									selectedTag = null;
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
					selectedTag = null;
					startDate = null;
					endDate = null;
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
	{#if $myAchievements.isLoading}
		<div class="flex justify-center">
			<Loader />
		</div>
	{/if}
	{#if $myAchievements.data.length === 0}
		<InfoBlock
			title="Empty Achievements"
			description="You don't have any achievements. Click add achievements"
		/>
	{/if}
</PageContainer>

<Drawer
	bind:isOpen={isMobileFiltersOpen}
	title="Filters"
	onSave={() => {
		$myAchievements.refetch();
		isMobileFiltersOpen = false;
	}}
	onCancel={() => {
		jobPositionID = null;
		educationID = null;
		selectedTag = null;
		startDate = null;
		endDate = null;
		$myAchievements.refetch();
		isMobileFiltersOpen = false;
	}}
>
	<div class="divide-y divide-gray-200">
		<div class="py-4">
			<DateInputV2 showDate value={startDate} onChange={(v) => (startDate = v)} />
			<DateInputV2 showDate value={endDate} onChange={(v) => (endDate = v)} />
		</div>
		<div class="py-4">
			<Select
				options={$myJobPositions.data?.map((e) => {
					return { id: e.id, label: e.name || undefined };
				}) || []}
				bind:value={jobPositionID}
				label="Job"
				oninput={() => {
					selectedTag = null;
					educationID = null;
				}}
			/>
		</div>
		<div class="py-4">
			<Select
				options={$myEducation.data?.map((e) => {
					return { id: e.id, label: e.institution || undefined };
				}) || []}
				bind:value={educationID}
				label="Education"
				oninput={() => {
					jobPositionID = null;
					selectedTag = null;
				}}
			/>
		</div>
		<div class="py-4">
			<Select
				options={$myAchTags.data?.map((a) => {
					return { id: a.id || '', label: a.name || undefined };
				}) || []}
				bind:value={selectedTag}
				label="Category"
			/>
		</div>
	</div>
	{#snippet actions()}
		<button
			class="btn btn-text--secondary"
			onclick={() => {
				jobPositionID = null;
				educationID = null;
				selectedTag = null;
				startDate = null;
				endDate = null;
				$myAchievements.refetch();
				isMobileFiltersOpen = false;
			}}>Reset</button
		>
	{/snippet}
</Drawer>

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
