<script lang="ts">
	interface Props {
		step: 1 | 2;
	}

	const { step }: Props = $props();

	const steps = [
		{ label: 'Step 1', name: 'First Achievement', href: '/onboard/achievement' },
		{ label: 'Step 2', name: 'Membership', href: '/onboard/membership' }
	];
</script>

<nav aria-label="Progress">
	<!-- Mobile: dot indicators -->
	<div class="flex items-center justify-center md:hidden">
		<p class="text-sm font-medium text-gray-900">Step {step} of {steps.length}</p>
		<ol role="list" class="ml-8 flex items-center space-x-5">
			{#each steps as s, idx}
				{@const stepNum = idx + 1}
				{@const isComplete = stepNum < step}
				{@const isCurrent = stepNum === step}
				<li>
					{#if isCurrent}
						<a href={s.href} aria-current="step" class="relative flex items-center justify-center">
							<span aria-hidden="true" class="absolute flex size-5 p-px">
								<span class="bg-primary/30 size-full rounded-full"></span>
							</span>
							<span aria-hidden="true" class="bg-primary relative block size-2.5 rounded-full"
							></span>
							<span class="sr-only">{s.label}</span>
						</a>
					{:else if isComplete}
						<a href={s.href} class="bg-primary hover:bg-primary-800 block size-2.5 rounded-full">
							<span class="sr-only">{s.label}</span>
						</a>
					{:else}
						<a href={s.href} class="block size-2.5 rounded-full bg-gray-200 hover:bg-gray-400">
							<span class="sr-only">{s.label}</span>
						</a>
					{/if}
				</li>
			{/each}
		</ol>
	</div>

	<!-- Desktop: labeled step bar -->
	<ol role="list" class="hidden md:flex md:space-x-8">
		{#each steps as s, idx}
			{@const stepNum = idx + 1}
			{@const isComplete = stepNum < step}
			{@const isCurrent = stepNum === step}
			<li class="flex-1">
				<a
					href={s.href}
					aria-current={isCurrent ? 'step' : undefined}
					class={[
						'flex flex-col border-t-4 pt-4 pb-0 pl-0',
						isComplete || isCurrent
							? 'border-primary group hover:border-primary-800'
							: 'group border-gray-200 hover:border-gray-300'
					].join(' ')}
				>
					<span
						class={[
							'text-sm font-medium',
							isComplete || isCurrent
								? 'text-primary group-hover:text-primary-800'
								: 'text-gray-500 group-hover:text-gray-700'
						].join(' ')}
					>
						{s.label}
					</span>
					<span class="text-sm font-medium text-gray-900">{s.name}</span>
				</a>
			</li>
		{/each}
	</ol>
</nav>
