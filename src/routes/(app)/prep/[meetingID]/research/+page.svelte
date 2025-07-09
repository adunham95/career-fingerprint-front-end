<script lang="ts">
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import StepList from '$lib/Components/StepList.svelte';
	import { getSteps } from '../steps.js';

	const { data } = $props();

	console.log({ data });
</script>

<PageContainer>
	<StepList currentStep={2} steps={getSteps(data.meetingID)} />
</PageContainer>
