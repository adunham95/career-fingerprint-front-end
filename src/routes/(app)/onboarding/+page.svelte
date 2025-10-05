<script lang="ts">
	let completedSteps = ['situation'];

	let steps = [
		{ title: 'Situation', key: 'situation' },
		{ title: 'First Position', key: 'position' },
		{ title: 'First Achievement', key: 'achievement' }
	];

	let currentStep = $state('position');

	$inspect(steps.findIndex((s) => s.key === currentStep));
</script>

<nav aria-label="Progress" class="mt-2 flex items-center justify-center lg:hidden">
	<p class="text-sm font-medium text-gray-900">
		Step {steps.findIndex((s) => s.key === currentStep) + 1 || 1} of {steps.length}
	</p>
	<ol role="list" class="ml-8 flex items-center space-x-5">
		{#each steps as step, idx}
			{@const hasCompletedStep = completedSteps.includes(step.key)}
			<!-- Completed Step -->
			<li>
				<button
					onclick={() => (currentStep = step.key)}
					class={`block size-2.5 rounded-full ${hasCompletedStep ? 'bg-primary hover:bg-primary-700' : 'bg-gray-200 hover:bg-gray-400'}`}
				>
					{#if currentStep === step.key}
						<span aria-hidden="true" class="bg-primary-700 relative block size-2.5 rounded-full"
						></span>
					{/if}
					<span class="sr-only">{step.title}</span>
				</button>
			</li>
		{/each}
	</ol>
</nav>

<div class="mx-auto flex w-full max-w-7xl items-start gap-x-8 px-4 py-10 sm:px-6 lg:px-8">
	<aside class="sticky top-8 hidden w-[200px] shrink-0 lg:block">
		<div class="px-4 py-12 sm:px-6 lg:px-8">
			<nav aria-label="Progress" class="flex justify-center">
				<ol role="list" class="space-y-6">
					{#each steps as step, idx}
						{@const hasCompletedStep = completedSteps.includes(step.key)}

						<li>
							<!-- Complete Step -->
							<button onclick={() => (currentStep = step.key)} class="group">
								<span class="flex items-start">
									<div class="relative flex size-5 shrink-0 items-center justify-center">
										{#if hasCompletedStep}
											<svg
												viewBox="0 0 20 20"
												fill="currentColor"
												data-slot="icon"
												aria-hidden="true"
												class="text-primary group-hover:text-primary-800 size-full"
											>
												<path
													d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
													clip-rule="evenodd"
													fill-rule="evenodd"
												/>
											</svg>
										{:else if currentStep === step.key}
											<span class="bg-primary-200 absolute size-4 rounded-full"></span>
											<div class="bg-primary-600 relative block size-2 rounded-full"></div>
										{:else}
											<div class="size-2 rounded-full bg-gray-300 group-hover:bg-gray-400"></div>
										{/if}
									</div>
									<span
										class="ml-3 text-left text-sm font-medium text-gray-500 group-hover:text-gray-900"
									>
										{step.title}
									</span>
								</span>
							</button>
						</li>
					{/each}
				</ol>
			</nav>
		</div>
	</aside>

	<main class="flex-1">
		<!-- Main area -->
	</main>
</div>
