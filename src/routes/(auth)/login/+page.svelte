<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_API_URL } from '$env/static/public';
	import Card from '$lib/Components/Containers/Card.svelte';
	import TextInput from '$lib/Components/FormElements/TextInput.svelte';
	import { toastStore } from '$lib/Components/Toasts/toast';
	import { trackingStore } from '$lib/Stores/tracking';
	import mixpanel from 'mixpanel-browser';
	import { onMount } from 'svelte';

	let email = $state('');
	let password = $state('');
	let isLoading = $state(false);
	let showError = $state(false);

	onMount(() => {
		trackingStore.pageViewEvent('Login');
	});

	async function login(e: SubmitEvent) {
		e.preventDefault();
		showError = false;
		trackingStore.trackAction('Login Click');

		console.log({ email, password });

		isLoading = true;
		const url = `${PUBLIC_API_URL}/auth/login`;

		try {
			const res = await fetch(url, {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json' // Set content type to JSON
				},
				body: JSON.stringify({
					email,
					password
				})
			});
			if (res.ok) {
				toastStore.show({ message: 'Successfully logged in', type: 'success' });
				const data = await res.json();
				console.log(data);
				mixpanel.identify(data.user.id);
				mixpanel.people.set({
					$email: data.user.email
				});
				await goto('/dashboard');
				isLoading = false;
			} else {
				const data = await res.json();
				console.log(res, data);
				showError = true;
				// toastStore.show({ message: 'Error logging in', type: 'error' });
				isLoading = false;
			}
		} catch (error) {
			showError = true;
			// toastStore.show({ message: 'Error logging in', type: 'error' });
			console.error('There was a problem with the fetch operation:', error);
			isLoading = false;
		}
	}
</script>

<Card headline="Sign in" className=" w-full max-w-[400px] mx-2" contentClassName="space-y-3">
	<p>
		Not a member? <a href="/get-started" class=" text-primary hover:text-primary-800"
			>Create your account</a
		>
	</p>
	{#if showError}
		<p class="text-error-600 text-sm">Invalid login credentials. Please try again.</p>
	{/if}
	<form onsubmit={(e) => login(e)} class="space-y-2">
		<TextInput id="email" label="Email" bind:value={email} autocomplete={'email webauthn'} />
		<TextInput
			id="password"
			label="Password"
			type="password"
			bind:value={password}
			autocomplete={'current-password webauthn'}
		/>
		<div class="flex w-full justify-between pt-2">
			<a href="/forgot-password" class="btn btn-text--primary btn-small">Forgot Password</a>
			<button disabled={isLoading} class="btn btn-text--primary btn-small">Login</button>
		</div>
	</form>
</Card>
