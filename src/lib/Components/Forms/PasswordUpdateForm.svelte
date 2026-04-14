<script lang="ts">
	import PasswordInput from '$lib/Components/FormElements/PasswordInput.svelte';
	import PasswordRequirements from '$lib/Components/FormElements/PasswordRequirements.svelte';
	import ErrorText from '$lib/Components/FormElements/ErrorText.svelte';
	import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
	import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
	import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en';

	zxcvbnOptions.setOptions({
		dictionary: { ...zxcvbnCommonPackage.dictionary, ...zxcvbnEnPackage.dictionary },
		graphs: zxcvbnCommonPackage.adjacencyGraphs,
		translations: zxcvbnEnPackage.translations
	});

	const strengthMeta: Record<
		number,
		{ label: string; bars: number; color: string; textColor: string }
	> = {
		0: { label: 'Too weak', bars: 1, color: 'bg-red-400', textColor: 'text-red-500' },
		1: { label: 'Weak', bars: 1, color: 'bg-red-400', textColor: 'text-red-500' },
		2: { label: 'Fair', bars: 2, color: 'bg-yellow-400', textColor: 'text-yellow-600' },
		3: { label: 'Good', bars: 3, color: 'bg-[#00bfa6]', textColor: 'text-[#00bfa6]' },
		4: { label: 'Strong', bars: 4, color: 'bg-[#00bfa6]', textColor: 'text-[#00bfa6]' }
	};

	interface Props {
		showCurrentPassword?: boolean;
		showConfirmPassword?: boolean;
		currentPassword?: string;
		newPassword?: string;
		confirmPassword?: string;
		errorText?: string;
	}

	let {
		showCurrentPassword = false,
		currentPassword = $bindable(''),
		newPassword = $bindable(''),
		showConfirmPassword = false,
		confirmPassword = $bindable(''),
		errorText = ''
	}: Props = $props();

	let strengthResult = $state<ReturnType<typeof zxcvbn> | null>(null);
	let strengthScore = $derived(strengthResult?.score ?? -1);
	let currentStrength = $derived(strengthScore >= 0 ? strengthMeta[strengthScore] : null);
	let strengthTimer: ReturnType<typeof setTimeout>;

	function handlePasswordBlur() {
		clearTimeout(strengthTimer);
		strengthTimer = setTimeout(() => {
			strengthResult = newPassword ? zxcvbn(newPassword) : null;
		}, 150);
	}
</script>

{#if showCurrentPassword}
	<PasswordInput
		id="current-password"
		label="Current Password"
		bind:value={currentPassword}
		autocomplete="current-password"
	/>
{/if}

<PasswordInput
	id="new-password"
	label="New Password"
	bind:value={newPassword}
	autocomplete="new-password"
	onblur={handlePasswordBlur}
/>

{#if newPassword && currentStrength}
	<div class="mt-1.5 space-y-1" aria-live="polite">
		<div class="flex gap-1" role="img" aria-label="Password strength: {currentStrength.label}">
			{#each [1, 2, 3, 4] as bar}
				<div
					class="h-1 flex-1 rounded-full transition-colors duration-200 {bar <= currentStrength.bars
						? currentStrength.color
						: 'bg-gray-200'}"
				></div>
			{/each}
		</div>
		<p class="text-xs {currentStrength.textColor}">{currentStrength.label}</p>
	</div>
{/if}

{#if showConfirmPassword}
	<PasswordInput
		id="confirm-password"
		label="Confirm Password"
		bind:value={confirmPassword}
		autocomplete="new-password"
	/>
{/if}

<ErrorText {errorText} />
