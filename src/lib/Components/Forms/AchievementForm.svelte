<script lang="ts">
	import TextArea from '../FormElements/TextArea.svelte';
	import Select from '../FormElements/Select.svelte';
	import DateInput from '../FormElements/DateInput.svelte';
	import { toastStore } from '../Toasts/toast';
	import { useMyEducationQuery } from '$lib/API/education';
	import { useMyJobPositionsQuery } from '$lib/API/job-positions';
	import AutocompleteTags from '../AutocompleteTags.svelte';
	import {
		useCreateAchievementMutation,
		useUpdateAchievementMutation
	} from '$lib/API/achievements';
	import type { Achievement } from '../../../app';
	import DateInputV2 from '../FormElements/DateInputV2.svelte';
	import SplitDateInput from '../FormElements/SplitDateInput.svelte';
	import { buildDateWithCurrentTime } from '$lib/Utils/buildDateWCurrentTime';

	interface Props {
		id: string;
		onSuccess?: () => void;
		achievement?: Partial<Achievement> | null;
		updateOnChange?: boolean;
	}

	let { id, onSuccess = () => null, achievement = $bindable({}) }: Props = $props();

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
		error = {};

		if (!myContribution) {
			error.myContribution = 'Missing Contribution';
			return;
		}

		if (!jobPositionID && !educationID) {
			error = {
				jobPositionID: 'Link Job or Education',
				educationID: 'Link Job or Education'
			};
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
		} catch (error) {
			toastStore.show({ message: 'Could not save achievement', type: 'error' });
		}
	}
</script>

<form {id} class="@container/new-achive-form" onsubmit={submitFunction}>
	<div class="grid gap-2">
		<TextArea
			id="ach-desc"
			label="Background"
			bind:value={description}
			errorText={error?.description}
		/>
		<TextArea
			id="ach-contriubution"
			label="What I Did"
			bind:value={myContribution}
			errorText={error?.myContribution}
		/>
		<TextArea
			id="ach-reult"
			label="What was the outcome"
			bind:value={result}
			errorText={error?.result}
		/>
		<Select
			id="select-job"
			label="Link To Job"
			bind:value={jobPositionID}
			options={($jobs.data || []).map((j) => ({ id: j.id, label: `${j.name} | ${j.company}` }))}
			errorText={error?.jobPositionID}
		/>
		<Select
			id="select-education"
			label="Link To Education"
			bind:value={educationID}
			options={($education.data || []).map((j) => ({
				id: j.id,
				label: `${j.degree} | ${j.institution}`
			}))}
			errorText={error?.educationID}
		/>
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
		<AutocompleteTags label="Category" id="ach-category" bind:value={selectedCategory} />
	</div>
</form>
