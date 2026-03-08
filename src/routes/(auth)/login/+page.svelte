<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_API_URL } from '$env/static/public';
	import SplitCard from '$lib/Components/Containers/SplitCard.svelte';
	import PasswordInput from '$lib/Components/FormElements/PasswordInput.svelte';
	import TextInput from '$lib/Components/FormElements/TextInput.svelte';
	import { toastStore } from '$lib/Components/Toasts/toast';
	import { trackingStore } from '$lib/Stores/tracking';
	import { onMount } from 'svelte';
	import AuthValueProps from '../authValueProps.svelte';

	const { data: pageData } = $props();

	let email = $state('');
	let password = $state('');
	let isLoading = $state(false);
	let showError = $state(false);
	let errorMessage = $state('Invalid login credentials. Please try again.');

	onMount(() => {
		trackingStore.pageViewEvent('Login');
	});

	async function login(e: SubmitEvent) {
		e.preventDefault();
		showError = false;

		console.log({ email, password });

		isLoading = true;
		const url = `${PUBLIC_API_URL}/auth/login`;

		try {
			const res = await fetch(url, {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email,
					password
				})
			});
			if (res.ok) {
				const data = await res.json();
				console.log(data);
				if (data.resetToken) {
					goto(`/reset-password?email=${data.user.email}&token=${data.resetToken}`);
				} else {
					trackingStore.identifyUser(data.user.id, data.user.email);
					toastStore.show({ message: 'Successfully logged in', type: 'success' });
					goto(pageData.redirectPath);
				}
				isLoading = false;
			} else {
				const data = await res.json();
				console.log(res, data);
				if (data.message) {
					errorMessage = data.message;
				}
				showError = true;
				isLoading = false;
			}
		} catch (error) {
			if (error instanceof Error) {
				errorMessage = error.message;
			} else {
				errorMessage = String(error);
			}
			showError = true;
			console.error('There was a problem with the fetch operation:', error);
			isLoading = false;
		}
	}
</script>

<SplitCard className="w-full max-w-[860px] md:mx-4" size="lg" actionsClassName="justify-between">
	{#snippet valueProp()}
		<AuthValueProps />
	{/snippet}

	<h3 class="font-title text-secondary mb-1 text-2xl font-normal">Welcome back.</h3>
	<p class="mb-6 text-sm tracking-wide text-gray-400">Pick up right where you left off.</p>

	{#if showError}
		<p class="text-error-600 mb-4 text-sm">{errorMessage}</p>
	{/if}

	<form
		id="login-form"
		onsubmit={(e) => {
			trackingStore.trackAction('Login Submit');
			login(e);
		}}
		class="space-y-3"
	>
		<TextInput id="email" label="Email" bind:value={email} autocomplete={'email webauthn'} />
		<PasswordInput
			id="password"
			label="Password"
			bind:value={password}
			autocomplete={'current-password webauthn'}
		/>
	</form>

	<div class="mt-6 border-t border-gray-100 pt-4 text-center">
		<p class="flex flex-col text-sm text-gray-400">
			<span> Don't have an account? </span>
			<a
				onclick={() => trackingStore.trackAction('Go To Register Click')}
				href="/register"
				class="text-primary hover:text-primary-700 md:ml-1"
			>
				Start a 14-day free trial
			</a>
		</p>
	</div>

	{#snippet actions()}
		<div class="flex w-full flex-col-reverse items-center justify-between gap-y-2 md:flex-row">
			<a
				href="/forgot-password"
				class="btn btn-text--primary md:btn-small w-full text-center"
				onclick={() => trackingStore.trackAction('Forgot Password Click')}
			>
				Forgot password?
			</a>
			<button
				disabled={isLoading}
				class="btn btn--secondary md:btn-small w-full text-center"
				type="submit"
				form="login-form"
				onclick={() => trackingStore.trackAction('Login Click')}
			>
				{isLoading ? 'Signing in...' : 'Sign In'}
			</button>
		</div>
	{/snippet}
</SplitCard>
