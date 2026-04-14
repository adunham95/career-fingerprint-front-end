<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import Card from '$lib/Components/Containers/Card.svelte';
	import TextInput from '$lib/Components/FormElements/TextInput.svelte';
	import BannerError from '$lib/Components/FormElements/BannerError.svelte';
	import { trackingStore } from '$lib/Stores/tracking';
	import { onMount } from 'svelte';

	let email = $state('');
	let isLoading = $state(false);
	let showError = $state(false);
	let showSuccess = $state(false);

	onMount(() => {
		trackingStore.pageViewEvent('Forgot Password');
	});

	async function requestReset(e: SubmitEvent) {
		e.preventDefault();

		if (!email) {
			showError = true;
			return;
		}

		showSuccess = false;
		showError = false;
		isLoading = true;

		try {
			const { error } = await authClient.requestPasswordReset({
				email,
				redirectTo: `${window.location.origin}/reset-password`
			});

			if (error) {
				showError = true;
				trackingStore.trackAction('Forgot Password Error');
			} else {
				showSuccess = true;
				trackingStore.trackAction('Forgot Password Sent');
			}
		} catch {
			showError = true;
		} finally {
			isLoading = false;
		}
	}
</script>

<Card headline="Forgot Password" className="w-full max-w-[400px] mx-2" contentClassName="space-y-3">
	{#if showSuccess}
		<div class="rounded-md bg-green-50 p-4">
			<p class="text-sm text-green-700">
				Check your email. If an account exists for that address, you'll receive a reset link shortly.
			</p>
		</div>
	{/if}

	{#if !showSuccess}
		<BannerError message={showError ? 'Something went wrong. Please try again.' : null} />
		<form onsubmit={requestReset} class="space-y-3">
			<TextInput
				id="email"
				label="Email"
				type="email"
				bind:value={email}
				autocomplete="email"
				placeholder="you@example.com"
			/>
			<div class="flex w-full items-center justify-between pt-2">
				<a href="/login" class="btn btn-text--primary btn-small">Back to login</a>
				<button disabled={isLoading || !email} type="submit" class="btn btn--primary btn-small">
					{isLoading ? 'Sending...' : 'Send Reset Link'}
				</button>
			</div>
		</form>
	{/if}
</Card>
