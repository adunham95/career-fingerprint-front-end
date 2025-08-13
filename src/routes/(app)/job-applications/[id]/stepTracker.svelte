<script lang="ts">
	import { AppStatusEnum } from '$lib/Utils/AppStatusTypes';

	let steps = [
		AppStatusEnum.APPLIED,
		AppStatusEnum.INTERVIEWING,
		AppStatusEnum.NEGOTIATION,
		AppStatusEnum.ACCEPTED
	];

	interface Props {
		currentStepName: string;
	}

	const { currentStepName }: Props = $props();

	let currentStep = $derived(steps.findIndex((s) => s === currentStepName));
</script>

<div aria-label="Progress" class="py-2">
	<ol
		role="list"
		class="divide-y divide-gray-300 rounded-md border border-gray-300 md:flex md:divide-y-0"
	>
		{#each steps as step, idx}
			<li class="relative md:flex md:flex-1">
				<div class="group flex items-center">
					<span class="flex items-center px-6 py-4 text-sm font-medium">
						<span
							class={`flex size-10 shrink-0 items-center justify-center rounded-full border-2  ${idx < currentStep && 'bg-primary border-primary  text-white'} ${idx === currentStep && 'border-primary text-primary '} ${idx > currentStep && 'border-gray-300'}`}
						>
							<span class="">{idx + 1}</span>
						</span>
						<span
							class={`g ml-4 text-sm font-medium  ${idx === currentStep ? 'text-primary' : 'text-gray-600'}`}
							>{step.toUpperCase()}</span
						>
					</span>
				</div>
				{#if idx < steps.length - 1}
					<div aria-hidden="true" class="absolute top-0 right-0 hidden h-full w-5 md:block">
						<svg
							viewBox="0 0 22 80"
							fill="none"
							preserveAspectRatio="none"
							class="size-full text-gray-300"
						>
							<path
								d="M0 -2L20 40L0 82"
								stroke="currentcolor"
								vector-effect="non-scaling-stroke"
								stroke-linejoin="round"
							/>
						</svg>
					</div>
				{/if}
			</li>
		{/each}
	</ol>
</div>
