<script lang="ts">
	import { useMyEducationQuery } from '$lib/API/education';
	import { useMyJobPositionsQuery } from '$lib/API/job-positions';
	import Select from '../FormElements/Select.svelte';
	import AssignToApplication from './AssignToApplication.svelte';

	interface Props {
		type: 'Interview' | 'Internal' | string | undefined;
		value?: {
			educationID?: string | null | undefined;
			jobPositionID?: string | null | undefined;
			jobAppID?: string | null | undefined;
		};
	}

	let { type, value = $bindable() }: Props = $props();

	let education = useMyEducationQuery();
	let jobPositions = useMyJobPositionsQuery();

	function onChange(type: 'educationID' | 'jobPositionID' | 'jobAppID', dataValue: string) {
		console.log('onChange', { type, dataValue });
		value = {
			educationID: undefined,
			jobPositionID: undefined,
			jobAppID: undefined,
			[type]: dataValue
		};
	}
</script>

{#if type === 'Interview'}
	<AssignToApplication
		className="space-y-2"
		oninput={(e) => onChange('jobAppID', e.target.value)}
	/>
{:else if type === 'Internal'}
	<Select
		id="select-job"
		label="Link To Job"
		options={[
			{ id: null, label: 'Select Job' },
			...($jobPositions.data || []).map((j) => ({
				id: j.id,
				label: `${j.name} | ${j.company}`
			}))
		]}
	/>
	<Select
		id="select-education"
		label="Link To Education"
		options={[
			{ id: null, label: 'Select Education' },
			...($education.data || []).map((j) => ({
				id: j.id,
				label: `${j.degree} | ${j.institution}`
			}))
		]}
	/>
{/if}
