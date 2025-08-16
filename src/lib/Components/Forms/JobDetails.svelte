<script lang="ts">
	import type { JobPosition } from '../../../app';
	import DateInput from '../FormElements/DateInput.svelte';
	import TextArea from '../FormElements/TextArea.svelte';
	import TextInput from '../FormElements/TextInput.svelte';
	import Toggle from '../FormElements/Toggle.svelte';

	interface Props {
		job: JobPosition;
		idx?: number;
	}

	const { job = $bindable(), idx = 0 }: Props = $props();
</script>

<div class="@container/job-details">
	<div class="grid grid-cols-1 gap-2 @sm/job-details:grid-cols-2 @md/job-details:grid-cols-3">
		<TextInput
			className="@sm/job-details:col-span-2 @md/job-details:col-span-3"
			id={'title' + idx}
			label="Title"
			bind:value={job.name}
		/>
		<TextInput
			className="@sm/job-details:col-span-2"
			id={'company' + idx}
			label="Company"
			bind:value={job.company}
		/>
		<TextInput
			className="@sm/job-details:col-span-2 @md/job-details:col-span-1"
			id={'location' + idx}
			label="Location"
			bind:value={job.location}
		/>
		<Toggle
			className="@sm/job-details:col-span-2 @md/job-details:col-span-1"
			label="Current Job"
			bind:checked={job.currentPosition}
		/>
		<DateInput id={'startDate' + idx} label="Start Date" bind:value={job.startDate} />
		{#if !job.currentPosition}
			<DateInput id={'endDate' + idx} label="End Date" bind:value={job.endDate} />
		{/if}
		<TextArea
			className="@sm/job-details:col-span-2 @md/job-details:col-span-3"
			id={'description' + idx}
			label="Summary"
			bind:value={job.description}
		></TextArea>
	</div>
</div>
