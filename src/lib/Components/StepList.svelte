<script lang="ts">
	interface Props {
		currentStep: number;
		steps: { path: string; label: string }[];
	}

	const { steps, currentStep = 0 }: Props = $props();

	function getStyle(idx: number) {
		// Current Step
		if (currentStep === idx) {
			return {
				text: 'text-primary ',
				border: 'border-primary  '
			};
		}

		// Upcoming Step
		if (currentStep < idx) {
			return {
				text: 'text-gray-500',
				border: 'border-gray-200'
			};
		}

		// Past Step
		return {
			text: 'text-primary group-hover:text-primary-800',
			border: 'border-primary hover:border-primary-800 '
		};
	}
</script>

<nav aria-label="Progress" class="print:hidden">
	<ol role="list" class="space-y-4 md:flex md:space-y-0 md:space-x-8">
		{#each steps as step, idx}
			<li class="md:flex-1">
				{#if currentStep < idx}
					<div
						class={`group flex flex-col border-l-4 py-2 pl-4 md:border-t-4 md:border-l-0 md:pt-4 md:pb-0 md:pl-0 ${getStyle(idx).border}`}
					>
						<span class={`text-sm font-medium ${getStyle(idx).text}`}>Step {idx + 1}</span>
						<span class="text-sm font-medium">{step.label}</span>
					</div>
				{:else}
					<a
						href={step.path}
						class={`group flex flex-col border-l-4 py-2 pl-4 md:border-t-4 md:border-l-0 md:pt-4 md:pb-0 md:pl-0 ${getStyle(idx).border}`}
					>
						<span class={`text-sm font-medium ${getStyle(idx).text}`}>Step {idx + 1}</span>
						<span class="text-sm font-medium">{step.label}</span>
					</a>
				{/if}
			</li>
		{/each}
	</ol>
</nav>
