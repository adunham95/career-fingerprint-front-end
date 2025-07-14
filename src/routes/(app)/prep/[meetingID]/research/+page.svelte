<script lang="ts">
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import StepHeader from '../StepHeader.svelte';
	import SaveAsType from './saveAsType.svelte';

	const { data } = $props();

	console.log({ data });
</script>

<!-- 
Research
Notes
Why your a good fit
-->

<PageContainer>
	<StepHeader currentStep={2} meetingID={data.meetingID || ''} />
	<ul class="mx-auto h-1 max-w-[500px] space-y-4">
		{#each data.questions || [] as question}
			<li>
				<SaveAsType
					id={question.id}
					label={question.question}
					value={question.prepAnswers[0]?.answer || ''}
					meetingID={data.meetingID || ''}
					jobApplicationID={data.meeting.jobAppID}
				/>
			</li>
		{/each}
	</ul>
</PageContainer>
