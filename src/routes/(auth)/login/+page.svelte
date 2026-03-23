<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_GOOGLE_LOGIN_ENABLED, PUBLIC_LINKEDIN_LOGIN_ENABLED } from '$env/static/public';
	import SplitCard from '$lib/Components/Containers/SplitCard.svelte';
	import PasswordInput from '$lib/Components/FormElements/PasswordInput.svelte';
	import TextInput from '$lib/Components/FormElements/TextInput.svelte';
	import { toastStore } from '$lib/Components/Toasts/toast';
	import { trackingStore } from '$lib/Stores/tracking';
	import { onMount } from 'svelte';
	import AuthValueProps from '../authValueProps.svelte';
	import GoogleSignIn from '$lib/Components/Buttons/GoogleSignIn.svelte';
	import LinkedinLogin from '$lib/Components/Buttons/LinkedinLogin.svelte';
	import { authClient } from '$lib/auth-client';

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
		isLoading = true;

		const { data, error } = await authClient.signIn.email({ email, password });

		if (error) {
			errorMessage = error.message ?? 'Invalid login credentials. Please try again.';
			showError = true;
			isLoading = false;
			return;
		}

		console.log(data);

		trackingStore.identifyUser(String(data.user.id), data.user.email);
		toastStore.show({ message: 'Successfully logged in', type: 'success' });
		goto(pageData.redirectPath);
		isLoading = false;
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
	<div class="flex justify-end">
		<a
			href="/forgot-password"
			class="btn btn-text--primary btn-small text-center"
			onclick={() => trackingStore.trackAction('Forgot Password Click')}
		>
			Forgot password?
		</a>
	</div>

	{#if PUBLIC_LINKEDIN_LOGIN_ENABLED === 'true' || PUBLIC_GOOGLE_LOGIN_ENABLED === 'true'}
		<div class="mt-2">
			<div class="relative">
				<div aria-hidden="true" class="absolute inset-0 flex items-center">
					<div class="w-full border-t border-gray-200"></div>
				</div>
				<div class="relative flex justify-center text-sm/6 font-medium">
					<span class="bg-white px-6 text-gray-900">Or continue with</span>
				</div>
			</div>

			<div class="mt-6 flex gap-4">
				<GoogleSignIn />

				<LinkedinLogin />
			</div>
		</div>
	{/if}

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
