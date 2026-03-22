<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import Card from '$lib/Components/Containers/Card.svelte';
	import TextInput from '$lib/Components/FormElements/TextInput.svelte';
	import { trackingStore } from '$lib/Stores/tracking';
	import { onMount } from 'svelte';

	let email = $state('');
	let isLoading = $state(false);
	let showError = $state(false);
	let showSuccess = $state(false);

	onMount(() => {
		trackingStore.pageViewEvent('Forgot Password');
	});

	async function login(e: SubmitEvent) {
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
			} else {
				showSuccess = true;
			}
		} catch (error) {
			showError = true;
		} finally {
			isLoading = false;
		}
	}
</script>

<Card
	headline="Forgot Password"
	className=" w-full max-w-[400px] mx-2"
	contentClassName="space-y-3"
>
	{#if showError}
		<p>Something went wrong. Please try again.</p>
	{/if}
	{#if showSuccess}
		<p>Check your email - if you have an account, you'll receive a reset link shortly.</p>
	{/if}
	<form onsubmit={(e) => login(e)} class="space-y-2">
		<TextInput id="email" label="Email" bind:value={email} autocomplete={'email webauthn'} />
		<div class="flex w-full justify-between pt-2">
			<a href="/login" class="btn btn-text--primary btn-small">Login</a>
			<button disabled={isLoading} type="submit" class="btn btn-text--primary btn-small">
				Reset Password
			</button>
		</div>
	</form>
</Card>
