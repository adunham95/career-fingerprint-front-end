<script lang="ts">
	import { PUBLIC_API_URL } from '$env/static/public';
	import { onDestroy } from 'svelte';
	import type { Education, JobPosition, Meeting } from '../../../app';
	import Select from '../FormElements/Select.svelte';
	import TextInput from '../FormElements/TextInput.svelte';
	import { toastStore } from '../Toasts/toast';
	import {
		createMutation,
		createQuery,
		type CreateBaseMutationResult,
		type QueryObserverResult
	} from '@tanstack/svelte-query';
	import { fetchMyEducation, myEducationQueryKey } from '$lib/API/Queries/my-education';
	import { fetchMyJobPositions, myJobPositionsQueryKey } from '$lib/API/Queries/my-jobs-positions';
	import AssignToJob from './AssignToJob.svelte';
	import { debounce } from '$lib/Utils/debounce';
	import { createMeeting, type CreateMeetingInput } from '$lib/API/Mutations/create-meeting';
	import { updateMeeting, type UpdateMeetingInput } from '$lib/API/Mutations/update-meet';

	interface Props {
		id: string;
		meetingID?: string;
		onSuccess?: () => void;
		meeting?: Partial<Meeting>;
		updateOnChange?: boolean;
	}

	const {
		id,
		meetingID,
		onSuccess = () => null,
		meeting = {},
		updateOnChange = false
	}: Props = $props();

	let title = $state(meeting.title);
	let time = $state<string | Date>(meeting?.time || new Date().toUTCString());
	let type = $state<string>(meeting.type || 'interview');
	let location = $state(meeting.location);
	let link = $state(meeting.link);
	let jobPositionID = $state(meeting.jobPositionID || null);
	let educationID = $state(meeting.educationID || null);
	let jobAppID = $state(meeting.jobAppID || null);

	$inspect({ time });

	let MyEducationQuery = createQuery<Education[]>({
		queryKey: [myEducationQueryKey],
		queryFn: async () => await fetchMyEducation()
	});

	let MyJobPositionsQuery = createQuery<JobPosition[]>({
		queryKey: [myJobPositionsQueryKey],
		queryFn: async () => await fetchMyJobPositions()
	});

	let education = $state<QueryObserverResult<Education[], Error>>();
	let jobPositions = $state<QueryObserverResult<JobPosition[], Error>>();

	const unsubscribeEducation = MyEducationQuery.subscribe((t) => {
		education = t;
	});
	const unsubscribeJobPositions = MyJobPositionsQuery.subscribe((t) => {
		jobPositions = t;
	});

	onDestroy(() => {
		unsubscribeEducation();
		unsubscribeJobPositions();
	});

	$inspect({ education, jobPositions });

	async function submitFunction(e: SubmitEvent) {
		e.preventDefault();
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

		if (meetingID) {
			update.mutate({ ...meetingDetails, id: meetingID });
		} else {
			save.mutate(meetingDetails);
		}
	}
	let save: CreateBaseMutationResult<Meeting | null, Error, Partial<CreateMeetingInput>, unknown>;
	let update: CreateBaseMutationResult<Meeting | null, Error, Partial<UpdateMeetingInput>, unknown>;

	const saveMutation = createMutation({
		mutationFn: createMeeting,
		onSuccess: (data) => {
			toastStore.show({ message: 'New Meeting Added', type: 'success' });
			title = undefined;
			time = '';
			type = 'interview';
			jobPositionID = null;
			educationID = null;
			location = undefined;
			link = undefined;
			onSuccess();
		},
		onError: () => {
			toastStore.show({ message: 'Could not save meeting', type: 'error' });
		}
	});

	const updateMutation = createMutation({
		mutationFn: updateMeeting,
		onSuccess: (data) => {
			toastStore.show({ message: 'Meeting Updated', type: 'success' });
			if (!updateOnChange) {
				title = undefined;
				time = '';
				type = 'interview';
				jobPositionID = null;
				educationID = null;
				location = undefined;
				link = undefined;
			}
			onSuccess();
		},
		onError: () => {
			toastStore.show({ message: 'Could not save meeting', type: 'error' });
		}
	});

	const unsubscribeSaveMeeting = saveMutation.subscribe((t) => {
		save = t;
	});
	const unsubscribeUpdateMeeting = updateMutation.subscribe((t) => {
		update = t;
	});

	onDestroy(() => {
		unsubscribeSaveMeeting();
		unsubscribeUpdateMeeting();
	});

	const saveToAPI = debounce(async () => {
		console.log('saving');
		update.mutate({
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
	}, 500);
</script>

<form {id} class="@container/new-achive-form" onsubmit={submitFunction}>
	<div class="grid gap-2">
		<TextInput
			id="evt-title"
			label="Event Title"
			bind:value={title}
			oninput={() => updateOnChange && saveToAPI()}
		/>
		<TextInput
			id="evt-time"
			label="Event Time"
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
				{ id: 'interview', label: 'Interview' },
				{ id: 'internal', label: 'Internal' }
			]}
		/>
		{#if type === 'interview'}
			<AssignToJob
				bind:selectedCompany={jobAppID}
				className="space-y-2"
				oninput={() => updateOnChange && saveToAPI()}
			/>
		{:else}
			<Select
				id="select-job"
				label="Link To Job"
				bind:value={jobPositionID}
				oninput={() => updateOnChange && saveToAPI()}
				options={jobPositions?.data?.map((j) => ({ id: j.id, label: `${j.name} | ${j.company}` }))}
			/>
			<Select
				id="select-education"
				label="Link To Education"
				bind:value={educationID}
				oninput={() => updateOnChange && saveToAPI()}
				options={education?.data?.map((j) => ({
					id: j.id,
					label: `${j.degree} | ${j.institution}`
				}))}
			/>
		{/if}
	</div>
</form>
