<script lang="ts">
	interface Props {
		step: 1 | 2 | 3;
	}

	const { step }: Props = $props();

	const steps = [
		{ label: 'Step 1', name: 'Job details', href: '/onboard/job' },
		{ label: 'Step 2', name: 'First Achievement', href: '/onboard/achievement' },
		{ label: 'Step 3', name: 'Membership', href: '/onboard/membership' }
	];
</script>

<nav aria-label="Progress">
	<ol role="list" class="space-y-4 md:flex md:space-y-0 md:space-x-8">
		{#each steps as s, idx}
			{@const stepNum = idx + 1}
			{@const isComplete = stepNum < step}
			{@const isCurrent = stepNum === step}
			<li class="md:flex-1">
				<a
					href={s.href}
					aria-current={isCurrent ? 'step' : undefined}
					class={[
						'flex flex-col border-l-4 py-2 pl-4 md:border-t-4 md:border-l-0 md:pt-4 md:pb-0 md:pl-0',
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
