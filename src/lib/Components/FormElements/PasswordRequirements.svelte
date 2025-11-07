<script lang="ts">
	import { validatePassword } from '$lib/Utils/validatePassword';

	let { password = '', className = '', confirmPassword = '' } = $props();

	let result = $derived(validatePassword(password, confirmPassword));
</script>

<div class={`${className} @container/pw-requirements`}>
	<div class="grid grid-cols-1 @md/pw-requirements:grid-cols-2 @2xl/pw-requirements:grid-cols-3">
		{#each result.requirements as req}
			<div class="flex items-center gap-2 text-xs">
				{#if req.pass}
					<!-- Passed -->
					<svg
						class="size-4 text-green-600"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						viewBox="0 0 24 24"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
					</svg>
					<span class="text-gray-700">{req.label}</span>
				{:else}
					<!-- Not passed -->
					<svg
						class="size-4 text-gray-400"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						viewBox="0 0 24 24"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
					<span class="text-gray-500">{req.label}</span>
				{/if}
			</div>
		{/each}
	</div>
</div>
