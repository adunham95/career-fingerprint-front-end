<script lang="ts">
	import { PUBLIC_API_URL } from '$env/static/public';
	import Card from '$lib/Components/Containers/Card.svelte';
	import TextInput from '$lib/Components/FormElements/TextInput.svelte';
	import { toastStore } from '$lib/Components/Toasts/toast';
	import { trackingStore } from '$lib/Stores/tracking';
	import { onMount } from 'svelte';

	let email = $state('');
	let password = $state('');
	let isLoading = $state(false);
	let showError = $state(false);
	let showSuccess = $state(false);

	onMount(() => {
		trackingStore.pageViewEvent('Forgot Password');
	});

	async function login(e: SubmitEvent) {
		e.preventDefault();

		console.log({ email, password });

		showSuccess = false;
		showError = false;
		isLoading = true;
		const url = `${PUBLIC_API_URL}/auth/request-reset`;

		try {
			const res = await fetch(url, {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email
				})
			});
			if (res.ok) {
				toastStore.show({ message: 'Successfully rest password', type: 'success' });
				const data = await res.json();
				console.log(data);
				isLoading = false;
				showSuccess = true;
			} else {
				const data = await res.json();
				isLoading = false;
				showError = true;
			}
		} catch (error) {
			console.error('There was a problem with the fetch operation:', error);
			isLoading = false;
			showError = true;
		}
	}
</script>

<Card
	headline="Forgot Password"
	className=" w-full max-w-[400px] mx-2"
	contentClassName="space-y-3"
>
	{#if showError}
		<p>There was an error resetting your password</p>
	{/if}
	{#if showSuccess}
		<p>Check your email for an reset link</p>
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
