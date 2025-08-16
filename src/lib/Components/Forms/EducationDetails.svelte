<script lang="ts">
	import type { Education } from '../../../app';
	import DateInput from '../FormElements/DateInput.svelte';
	import TextArea from '../FormElements/TextArea.svelte';
	import TextInput from '../FormElements/TextInput.svelte';
	import Toggle from '../FormElements/Toggle.svelte';

	interface Props {
		education: Education;
		idx?: number;
	}

	const { education = $bindable(), idx = 0 }: Props = $props();
</script>

<div class="@container/education-details">
	<div
		class="grid grid-cols-1 gap-2 @sm/education-details:grid-cols-2 @md/education-details:grid-cols-3"
	>
		<TextInput
			className=" @md/education-details:col-span-2 "
			id="degree"
			label="Degree"
			bind:value={education.degree}
		/>
		<TextInput id="institution" label="Institution" bind:value={education.institution} />
		<TextArea
			className="@sm/education-details:col-span-2 @md/education-details:col-span-3"
			id="description"
			label="Description"
			bind:value={education.description}
		></TextArea>
		<Toggle
			className="@sm/education-details:col-span-2 @md/education-details:col-span-1"
			label="Currently In School"
			bind:checked={education.currentPosition}
		/>
		<DateInput id={'startDate' + idx} label="Start Date" bind:value={education.startDate} />
		{#if !education.currentPosition}
			<DateInput id={'endDate' + idx} label="End Date" bind:value={education.endDate} />
		{/if}
	</div>
</div>
