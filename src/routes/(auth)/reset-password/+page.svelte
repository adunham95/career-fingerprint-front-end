<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { authClient } from '$lib/auth-client';
	import Card from '$lib/Components/Containers/Card.svelte';
	import BannerError from '$lib/Components/FormElements/BannerError.svelte';
	import PasswordUpdateForm from '$lib/Components/Forms/PasswordUpdateForm.svelte';
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
	let bannerError = $state<string | null>(null);

	async function resetPassword(e: SubmitEvent) {
		e.preventDefault();
		bannerError = null;

		if (!token) {
			toastStore.show({
				message: 'That reset link has expired. Request a new one from the sign in page.',
				type: 'error'
			});
			return;
		}

		const { isValid, requirements } = validatePassword(password, confirmPassword, true);

		if (!isValid) {
			const failing = requirements.filter((r) => !r.pass).map((r) => r.errorLabel);
			bannerError = failing.join(' · ');
			return;
		}

		isLoading = true;

		const { error } = await authClient.resetPassword({ newPassword: password, token });

		isLoading = false;

		if (error) {
			bannerError = error.message ?? 'Something went wrong. Please try again.';
		} else {
			trackingStore.trackAction('Password Reset Success');
			toastStore.show({ message: 'Password updated. Please sign in.', type: 'success' });
			await goto('/login');
		}
	}
</script>

<Card headline="Reset Password" className=" w-full max-w-[400px] mx-2" contentClassName="space-y-3">
	<form onsubmit={resetPassword} class="space-y-3">
		<BannerError message={bannerError} />
		<PasswordUpdateForm showConfirmPassword bind:newPassword={password} bind:confirmPassword />
		<div class="flex w-full justify-between pt-2">
			<a href="/login" class="btn btn-text--primary btn-small">Back to login</a>
			<button disabled={isLoading} class="btn btn--primary btn-small">
				{isLoading ? 'Updating...' : 'Reset Password'}
			</button>
		</div>
	</form>
</Card>
