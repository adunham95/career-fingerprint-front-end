<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { authClient } from '$lib/auth-client';
	import Card from '$lib/Components/Containers/Card.svelte';
	import ErrorText from '$lib/Components/FormElements/ErrorText.svelte';
	import PasswordRequirements from '$lib/Components/FormElements/PasswordRequirements.svelte';
	import TextInput from '$lib/Components/FormElements/TextInput.svelte';
	import { toastStore } from '$lib/Components/Toasts/toast';
	import { trackingStore } from '$lib/Stores/tracking';
	import { validatePassword } from '$lib/Utils/validatePassword';
	import { onMount } from 'svelte';

	const token = page.url.searchParams.get('token');

	onMount(() => {
		trackingStore.pageViewEvent('Reset Password');
	});

	let password = $state('');
	let confirmPassword = $state('');
	let isLoading = $state(false);
	let errorText = $state<null | string>(null);

	async function resetPassword(e: SubmitEvent) {
		e.preventDefault();

		if (!token) {
			toastStore.show({ message: 'Invalid or expired reset link', type: 'error' });
			return;
		}

		const passwordResult = validatePassword(password, confirmPassword, true);

		if (!passwordResult.isValid) {
			errorText = 'Password missing requirements';
			return;
		}

		isLoading = true;
		errorText = null;

		const { error } = await authClient.resetPassword({ newPassword: password, token });

		isLoading = false;

		if (error) {
			errorText = error.message ?? 'Something went wrong. Please try again.';
		} else {
			toastStore.show({ message: 'Successfully reset password', type: 'success' });
			await goto('/login');
		}
	}
</script>

<Card headline="Reset Password" className=" w-full max-w-[400px] mx-2" contentClassName="space-y-3">
	<form onsubmit={resetPassword} class="space-y-2">
		<TextInput id="password" label="Password" bind:value={password} autocomplete="new-password" />
		<TextInput
			id="confirmPassword"
			label="Confirm Password"
			bind:value={confirmPassword}
			autocomplete="new-password"
		/>
		<ErrorText {errorText} />
		<PasswordRequirements useConfirmPassword {confirmPassword} {password} />
		<div class="flex w-full justify-between pt-2">
			<a href="/login" class="btn btn-text--primary btn-small">Login</a>
			<button disabled={isLoading} class="btn btn-text--primary btn-small">Reset Password</button>
		</div>
	</form>
</Card>
