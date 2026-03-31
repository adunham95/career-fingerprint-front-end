<script lang="ts">
	import TextArea from '../FormElements/TextArea.svelte';
	import Select from '../FormElements/Select.svelte';
	import { toastStore } from '../Toasts/toast';
	import { useMyEducationQuery } from '$lib/API/education';
	import { useMyJobPositionsQuery } from '$lib/API/job-positions';
	import AutocompleteTags from '../AutocompleteTags.svelte';
	import {
		useCreateAchievementMutation,
		useUpdateAchievementMutation
	} from '$lib/API/achievements';
	import type { Achievement, CurrentUser } from '../../../app';
	import SplitDateInput from '../FormElements/SplitDateInput.svelte';
	import { buildDateWithCurrentTime } from '$lib/Utils/buildDateWCurrentTime';
	import InfoBlock from '../InfoBlock.svelte';
	import { useFeatureGate } from '$lib/Utils/featureGate';
	import FeatureBlock from '../FeatureBlock.svelte';
	import Modal from '../Overlays/Modal.svelte';
	import { ApiError } from '$lib/API/apiClient';
	import { trackingStore } from '$lib/Stores/tracking';

	interface Props {
		id: string;
		onSuccess?: () => void;
		achievement?: Partial<Achievement> | null;
		updateOnChange?: boolean;
		isMocking?: boolean;
		user?: CurrentUser | null;
	}

	let {
		id,
		onSuccess = () => null,
		achievement = $bindable({}),
		isMocking = false,
		user = null
	}: Props = $props();

	const canLinkAchievements = $derived(useFeatureGate('achievements:link', user));

	$inspect(achievement);

	let description = $state('');
	let myContribution = $state('');
	let result = $state('');
	let jobPositionID = $state<string | null>(null);
	let educationID = $state<string | null>(null);
	let startDate = $state<string | null>(null);
	let startMonth = $state<string>('');
	let startDay = $state<string>('');
	let startYear = $state<string>('');
	let endDate = $state<string | null>(null);
	let selectedCategory = $state('');
	let error = $state<{ [key: string]: string }>({});
	let linkType = $state<'job' | 'education'>('job');
	let showLimitModal = $state(false);
	let limitMessage = $state('');

	let education = useMyEducationQuery();
	let jobs = useMyJobPositionsQuery();

	let newAchievement = useCreateAchievementMutation();
	let updateAchievement = useUpdateAchievementMutation();

	let lastAchievementId: string | undefined;

	const parseDate = (dateStr: string | null | undefined): Date => {
		if (!dateStr || dateStr === '') return new Date();
		const parsed = new Date(dateStr);
		return isNaN(parsed.getTime()) ? new Date() : parsed;
	};

	$effect(() => {
		if (achievement && achievement?.id !== lastAchievementId) {
			lastAchievementId = achievement?.id;
			description = achievement.description || '';
			myContribution = achievement.myContribution || '';
			result = achievement.result || '';
			jobPositionID = achievement.jobPosition?.id || achievement.jobPositionID || null;
			educationID = achievement.education?.id || achievement.educationID || null;
			startDate = achievement.startDate || null;
			endDate = achievement.endDate || null;

			const initialStartDate: Date = parseDate(achievement.startDate);

			startDay = initialStartDate.getDate().toString();
			startMonth = initialStartDate.getMonth().toString();
			startYear = initialStartDate.getFullYear().toString();

			selectedCategory = achievement.tags?.[0]?.name ?? '';
			error = {};
		} else {
			// if null, clear the form
			description = '';
			myContribution = '';
			result = '';
			jobPositionID = null;
			educationID = null;
			startDate = null;
			endDate = null;
			selectedCategory = '';
			error = {};
		}
	});

	async function submitFunction(e: SubmitEvent) {
		e.preventDefault();
		if (isMocking) {
			toastStore.show({ message: 'New Achievement Added', type: 'success' });
		}

		error = {};

		if (!myContribution) {
			error.myContribution = 'Missing Contribution';
			return;
		}

		let achDetails = {
			description,
			result,
			myContribution,
			jobPositionID,
			educationID,
			achievementTags: selectedCategory === '' ? [] : [selectedCategory],
			startDate: startMonth
				? buildDateWithCurrentTime(startYear, startMonth, startDay).toISOString()
				: null
			// endDate: endDate ? new Date(endDate).toISOString() : null
		};

		try {
			if (achievement?.id) {
				await $updateAchievement.mutateAsync({
					id: achievement.id,
					achievement: achDetails
				});
				toastStore.show({ message: 'Achievement Updated', type: 'success' });
			} else {
				await $newAchievement.mutateAsync(achDetails);
				toastStore.show({ message: 'New Achievement Added', type: 'success' });
			}
			description = '';
			myContribution = '';
			result = '';
			startDate = null;
			endDate = null;
			jobPositionID = null;
			educationID = null;
			selectedCategory = '';
			onSuccess();
		} catch (err) {
			if (err instanceof ApiError && err.statusCode === 403) {
				limitMessage = err.message;
				showLimitModal = true;
			} else {
				toastStore.show({
					message: err?.message || 'Could not save your achievement. Try again.',
					type: 'error'
				});
			}
		}
	}
</script>

<Modal bind:isOpen={showLimitModal} title="You've hit your limit">
	{#snippet children()}
		<div class="mt-1 space-y-3">
			<p class="text-sm text-gray-600">{limitMessage}</p>
			<p class="text-sm text-gray-600">
				Upgrade your plan to keep adding achievements and building your career fingerprint.
			</p>
		</div>
	{/snippet}
	{#snippet actions()}
		<button
			type="button"
			onclick={() => (showLimitModal = false)}
			class="rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
		>
			Maybe later
		</button>
		<a
			href="/setting/membership/"
			onclick={() => {
				trackingStore.trackAction('Upgrade Membership Click - Achievement Limit');
				showLimitModal = false;
			}}
			class="bg-primary hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium text-white"
		>
			Upgrade plan
		</a>
	{/snippet}
</Modal>

<form {id} class="@container/new-achive-form" onsubmit={submitFunction}>
	<div class="grid gap-2">
		<TextArea
			id="ach-desc"
			label="Situation"
			subLabel="What was the context or challenge?"
			placeholder="e.g. We were losing customers due to a slow, frustrating onboarding process…"
			bind:value={description}
			errorText={error?.description}
		/>
		<TextArea
			id="ach-contriubution"
			label="Task/Action"
			subLabel="What did you do? What was your specific role?"
			placeholder="e.g. I coordinated across three teams and built a plan to address it directly…"
			bind:value={myContribution}
			errorText={error?.myContribution}
		/>
		<TextArea
			id="ach-reult"
			label="Result"
			subLabel="What happened? Quantify the impact if you can."
			placeholder="e.g. The team hit their targets for the first time in two quarters…"
			bind:value={result}
			errorText={error?.result}
		/>
		{#if canLinkAchievements}
			<p>Link To:</p>
			<nav aria-label="Tabs" class="flex space-x-4">
				<!-- Current: "bg-indigo-100 text-indigo-700", Default: "text-gray-500 hover:text-gray-700" -->
				<button
					type="button"
					onclick={() => {
						linkType = 'job';
						educationID = null;
					}}
					class={`rounded-md px-3 py-2 text-sm font-medium  ${linkType === 'job' ? 'bg-primary/75' : 'text-gray-500 hover:bg-gray-200 hover:text-gray-700'}`}
				>
					Job
				</button>
				<button
					type="button"
					onclick={() => {
						linkType = 'education';
						jobPositionID = null;
					}}
					class={`rounded-md px-3 py-2 text-sm font-medium  ${linkType === 'education' ? 'bg-primary/75' : 'text-gray-500 hover:bg-gray-200 hover:text-gray-700'}`}
				>
					Education
				</button>
			</nav>
			{#if linkType === 'job'}
				{#if ($jobs.data?.length || 0) > 0}
					<Select
						id="select-job"
						label="Link To Job"
						bind:value={jobPositionID}
						options={[
							{ id: null, label: 'Select a Job' },
							...($jobs.data || []).map((j) => ({ id: j.id, label: `${j.name} | ${j.company}` }))
						]}
						errorText={error?.jobPositionID}
					/>
				{:else}
					<InfoBlock icon="lightbulb" title="Missing Job">
						Add a job in Your Fingerprint, then come back to link this achievement to it.
						<a class="font-bold" href="/my-fingerprint"> Go to My Fingerprint </a>
					</InfoBlock>
				{/if}
			{:else if linkType === 'education'}
				{#if ($education.data?.length || 0) > 0}
					<Select
						id="select-education"
						label="Link To Education"
						bind:value={educationID}
						options={[
							{ id: null, label: 'Select Education' },
							...($education.data || []).map((j) => ({
								id: j.id,
								label: `${j.degree} | ${j.institution}`
							}))
						]}
						errorText={error?.educationID}
					/>
				{:else}
					<InfoBlock icon="lightbulb" title="Missing Education">
						Add a education in Your Fingerprint, then come back to link this achievement to it.
						<a class="font-bold" href="/my-fingerprint"> Go to My Fingerprint </a>
					</InfoBlock>
				{/if}
			{/if}
		{:else}
			<FeatureBlock
				title="Link Achievements"
				description="A Premium version of needed to link achievements to jobs or eduction"
			/>
		{/if}
		<!-- TODO Figure out date details -->
		<SplitDateInput
			label="Start Date"
			id="ach-start"
			bind:month={startMonth}
			bind:day={startDay}
			bind:year={startYear}
			showDate
		/>
		<!-- showDate -->
		<!-- <DateInput label="End Date" id="ach-end" bind:value={endDate} showDate /> -->
		<AutocompleteTags
			label="Category"
			id="ach-category"
			placeholder="Type to search or create Category"
			bind:value={selectedCategory}
		/>
	</div>
</form>
