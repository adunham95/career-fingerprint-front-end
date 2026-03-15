<script>
	import { validatePassword } from '$lib/Utils/validatePassword';

	export let password = '';
	export let confirmPassword = '';
	export let useConfirmPassword = false;

	const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

	const barColors = ['', 'bg-[#ff7a8a]', 'bg-[#ffb347]', 'bg-[#00bfa6]', 'bg-[#00bfa6]'];

	const labelColors = ['', 'text-[#ff7a8a]', 'text-[#ffb347]', 'text-[#00bfa6]', 'text-[#00bfa6]'];

	$: ({ strength } = validatePassword(password, confirmPassword, useConfirmPassword));
	$: show = password.length > 0;
</script>

{#if show}
	<div class="mt-2 flex items-center gap-2.5">
		<div class="flex flex-1 gap-1">
			{#each [1, 2, 3, 4] as level}
				<div
					class="h-1 flex-1 rounded-full transition-colors duration-300 {strength >= level
						? barColors[strength]
						: 'bg-gray-200'}"
				></div>
			{/each}
		</div>
		<span
			class="w-10 text-right text-[11px] font-semibold tracking-wide uppercase transition-colors duration-300 {labelColors[
				strength
			]}"
		>
			{labels[strength]}
		</span>
	</div>
{/if}
