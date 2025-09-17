<script lang="ts">
	import TextArea from '../FormElements/TextArea.svelte';
	import Select from '../FormElements/Select.svelte';
	import DateInput from '../FormElements/DateInput.svelte';
	import { toastStore } from '../Toasts/toast';
	import { useMyEducationQuery } from '$lib/API/education';
	import { useMyJobPositionsQuery } from '$lib/API/job-positions';
	import AutocompleteTags from '../AutocompleteTags.svelte';
	import { useCreateAchievementMutation } from '$lib/API/achievements';

	interface Props {
		id: string;
		onSuccess?: () => void;
	}

	const { id, onSuccess = () => null }: Props = $props();

	let description = $state('');
	let myContribution = $state('');
	let result = $state('');
	let jobPositionID = $state(null);
	let educationID = $state(null);
	let startDate = $state(null);
	let endDate = $state(null);
	let selectedCategory = $state('');
	let error = $state<{ [key: string]: string }>({});

	let education = useMyEducationQuery();
	let jobs = useMyJobPositionsQuery();

	let newAchievement = useCreateAchievementMutation();

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

		try {
			$newAchievement.mutateAsync({
				description,
				result,
				myContribution,
				jobPositionID,
				educationID,
				achievementTags: selectedCategory === '' ? [] : [selectedCategory],
				startDate: startDate ? new Date(startDate).toISOString() : null,
				endDate: endDate ? new Date(endDate).toISOString() : null
			});
			toastStore.show({ message: 'New Achievement Added', type: 'success' });
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
		<DateInput label="Start Date" id="ach-start" bind:value={startDate} showDate />
		<DateInput label="End Date" id="ach-end" bind:value={endDate} showDate />
		<AutocompleteTags label="Category" id="ach-category" bind:value={selectedCategory} />
	</div>
</form>
