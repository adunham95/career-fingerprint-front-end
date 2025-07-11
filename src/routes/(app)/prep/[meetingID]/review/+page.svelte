<script lang="ts">
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import StepList from '$lib/Components/StepList.svelte';
	import StepHeader from '../StepHeader.svelte';
	import { getSteps } from '../steps.js';

	const { data } = $props();

	console.log({ data });
</script>

<!-- 
Questions
Additional Notes
-->

<PageContainer>
	<StepHeader currentStep={3} meetingID={data.meetingID || ''} />
	<div></div>
</PageContainer>
