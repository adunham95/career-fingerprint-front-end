<script lang="ts">
	import type { Meeting } from '../../../app';
	import Select from '../FormElements/Select.svelte';
	import TextInput from '../FormElements/TextInput.svelte';
	import { toastStore } from '../Toasts/toast';
	import AssignToJob from './AssignToJob.svelte';
	import { debounce } from '$lib/Utils/debounce';
	import { useCreateMeetingMutation, useUpdateMeetingMutation } from '$lib/API/meeting';
	import { useMyEducationQuery } from '$lib/API/education';
	import { useMyJobPositionsQuery } from '$lib/API/job-positions';
	import { getLocalDateTimeValue } from '$lib/Utils/getLocalDateTimeValue';
	import { trackingStore } from '$lib/Stores/tracking';

	interface Props {
		id: string;
		meetingID?: string;
		onSuccess?: () => void;
		meeting?: Partial<Meeting> | null;
		updateOnChange?: boolean;
	}

	const {
		id,
		meetingID,
		onSuccess = () => null,
		meeting = $bindable({}),
		updateOnChange = false
	}: Props = $props();

	$effect(() => {
		if (!meeting) return;

		title = meeting.title ?? '';
		time = meeting.time ? getLocalDateTimeValue(new Date(meeting.time)) : getLocalDateTimeValue();
		type = meeting.type ?? 'Interview';
		location = meeting.location ?? '';
		link = meeting.link ?? '';
		jobPositionID = meeting.jobPositionID ?? null;
		educationID = meeting.educationID ?? null;
		jobAppID = meeting.jobAppID ?? null;
	});

	let title = $state(meeting?.title);
	let time = $state<string | Date>(
		meeting?.time ? getLocalDateTimeValue(new Date(meeting?.time)) : getLocalDateTimeValue()
	);
	let type = $state<string>(meeting?.type || 'Interview');
	let location = $state(meeting?.location);
	let link = $state(meeting?.link);
	let jobPositionID = $state(meeting?.jobPositionID || null);
	let educationID = $state(meeting?.educationID || null);
	let jobAppID = $state(meeting?.jobAppID || null);
	let error = $state<{ [key: string]: string }>({});

	const saveMeetingMutation = useCreateMeetingMutation();
	const updateMeetingMutation = useUpdateMeetingMutation(meetingID || '');
	let education = useMyEducationQuery();
	let jobPositions = useMyJobPositionsQuery();

	async function submitFunction(e: SubmitEvent) {
		e.preventDefault();
		trackingStore.trackAction('Update Meeting');
		error = {};

		console.log({ type, jobAppID });

		if (type === 'Interview' && !jobAppID) {
			error.jobAppID = 'Missing job for interview';
			return;
		}
		if (type === 'Internal' && !jobPositionID && !educationID) {
			error = {
				jobPositionID: 'Link Job or Education',
				educationID: 'Link Job or Education'
			};
			return;
		}

		let meetingDetails = {
			title,
			time: time ? new Date(time).toISOString() : null,
			type,
			jobAppID,
			jobPositionID,
			educationID,
			location,
			link
		};

		try {
			if (meetingID) {
				$updateMeetingMutation.mutateAsync({ ...meetingDetails, id: meetingID });
				toastStore.show({ message: 'Meeting Updated' });
			} else {
				$saveMeetingMutation.mutateAsync(meetingDetails);
				toastStore.show({ message: 'Meeting Created' });
			}
			onSuccess();
		} catch (error) {
			toastStore.show({ message: 'Error Updating Meeting' });
		}
	}

	const saveToAPI = debounce(async () => {
		console.log('saving');
		try {
			$updateMeetingMutation.mutateAsync({
				id: meetingID,
				title,
				time: time ? new Date(time).toISOString() : null,
				type,
				jobAppID,
				jobPositionID,
				educationID,
				location,
				link
			});
			toastStore.show({ message: 'Meeting Updated' });
		} catch (error) {
			toastStore.show({ message: 'Error Updating Meeting' });
		}
	}, 500);
</script>

<form {id} class="@container/new-achive-form" onsubmit={submitFunction}>
	<div class="grid gap-2">
		<TextInput
			id="evt-title"
			label="Event Title"
			required
			bind:value={title}
			oninput={() => updateOnChange && saveToAPI()}
		/>
		<TextInput
			id="evt-time"
			label="Event Date"
			type="datetime-local"
			bind:value={time}
			required
			oninput={() => updateOnChange && saveToAPI()}
		/>
		<TextInput
			id="evt-location"
			label="Event Location"
			bind:value={location}
			oninput={() => updateOnChange && saveToAPI()}
		/>
		<TextInput
			id="evt-link"
			label="Event Link"
			bind:value={link}
			oninput={() => updateOnChange && saveToAPI()}
		/>
		<Select
			id="evt-type"
			label="Type"
			oninput={() => updateOnChange && saveToAPI()}
			bind:value={type}
			options={[
				{ id: 'Interview', label: 'Interview' },
				{ id: 'Internal', label: 'Internal' }
			]}
		/>
		{#if type === 'Interview'}
			<AssignToJob
				bind:selectedCompany={jobAppID}
				className="space-y-2"
				oninput={() => updateOnChange && saveToAPI()}
				errorText={error.jobAppID}
			/>
		{:else}
			<Select
				id="select-job"
				label="Link To Job"
				bind:value={jobPositionID}
				oninput={() => updateOnChange && saveToAPI()}
				options={($jobPositions.data || []).map((j) => ({
					id: j.id,
					label: `${j.name} | ${j.company}`
				}))}
				errorText={error.jobPositionID}
			/>
			<Select
				id="select-education"
				label="Link To Education"
				bind:value={educationID}
				oninput={() => updateOnChange && saveToAPI()}
				options={($education.data || []).map((j) => ({
					id: j.id,
					label: `${j.degree} | ${j.institution}`
				}))}
				errorText={error.educationID}
			/>
		{/if}
	</div>
</form>
