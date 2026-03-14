<script lang="ts">
	import { goto, preloadCode } from '$app/navigation';
	import { useRegisterUserMutation } from '$lib/API/user';
	import SplitCard from '$lib/Components/Containers/SplitCard.svelte';
	import ErrorText from '$lib/Components/FormElements/ErrorText.svelte';
	import PasswordInput from '$lib/Components/FormElements/PasswordInput.svelte';
	import PasswordRequirements from '$lib/Components/FormElements/PasswordRequirements.svelte';
	import TextInput from '$lib/Components/FormElements/TextInput.svelte';
	import { toastStore } from '$lib/Components/Toasts/toast';
	import { trackingStore } from '$lib/Stores/tracking';
	import { validatePassword } from '$lib/Utils/validatePassword';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import AuthValueProps from '../authValueProps.svelte';

	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let firstName = $state('');
	let lastName = $state('');
	let isLoading = $state(false);
	let accountCreated = $state(false);
	let errorText = $state<{ [key: string]: string }>({});
	let hasRequired = $derived(!!email);

	const trackedFields = new Set<string>();

	function trackFieldFilled(field: string, value: string) {
		if (value && !trackedFields.has(field)) {
			trackedFields.add(field);
			trackingStore.trackAction('Register - Field Filled', { field });
		}
	}

	const orgID = page.url.searchParams.get('org') || undefined;

	const urlParams = new URLSearchParams(page.url.search || '');
	const redirectPath = urlParams.get('redirect') || '/onboard/achievement';

	let registerUser = useRegisterUserMutation();

	onMount(() => {
		trackingStore.pageViewEvent('Register');
		trackingStore.trackSession();
	});

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	async function login() {
		errorText = {};
		isLoading = true;
		if (!email) {
			errorText['email'] = 'Email Required';
			trackingStore.trackAction('Register - Validation Error', {
				field: 'email',
				reason: 'required'
			});
		}
		if (!emailRegex.test(email)) {
			errorText['email'] = 'Please enter a valid email address';
			trackingStore.trackAction('Register - Validation Error', {
				field: 'email',
				reason: 'invalid_format'
			});
		}
		if (!validatePassword(password, confirmPassword).isValid) {
			errorText['password'] = 'Please make sure your password meets all requirements';
			trackingStore.trackAction('Register - Validation Error', {
				field: 'password',
				reason: 'invalid'
			});
		}

		if (Object.keys(errorText).length > 0) {
			isLoading = false;
			trackingStore.trackAction('Registered Account Validation Error', {
				error: JSON.stringify(errorText)
			});
			toastStore.show({ message: 'Error Creating Account', type: 'error' });
			return;
		}

		try {
			const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

			const newUser = await $registerUser.mutateAsync({
				firstName,
				lastName,
				email,
				password,
				timezone,
				orgID
			});

			trackingStore.identifyUser(String(newUser.user.id), newUser.user.email);
			trackingStore.trackAction('Registered Account Success');
			accountCreated = true;
			preloadCode(redirectPath);
			goto(redirectPath);

			isLoading = false;
		} catch (error) {
			toastStore.show({ message: 'Error Creating Account', type: 'error' });
			console.error('There was a problem with the fetch operation:', error);
			const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
			trackingStore.trackAction('Registered Account Error', { error: errorMessage });
			isLoading = false;
		}
	}
</script>

<SplitCard
	className="w-full max-w-[860px] md:mx-4"
	size="lg"
	actionsClassName="justify-between"
	leftClassName="hidden md:block"
>
	{#snippet valueProp()}
		<AuthValueProps />
	{/snippet}

	{#if accountCreated}
		<div class="flex flex-col items-center justify-center py-8 text-center">
			<div class="bg-primary/10 mb-4 flex h-14 w-14 items-center justify-center rounded-full">
				<svg
					class="text-primary h-7 w-7"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
				</svg>
			</div>
			<h3 class="font-title text-secondary mb-2 text-2xl font-normal">Account created!</h3>
			<p class="text-sm text-gray-600">Setting up your workspace, just a moment...</p>
			<div class="mt-4 flex gap-1">
				<span class="bg-primary/40 h-2 w-2 animate-bounce rounded-full" style="animation-delay: 0ms"
				></span>
				<span
					class="bg-primary/40 h-2 w-2 animate-bounce rounded-full"
					style="animation-delay: 150ms"
				></span>
				<span
					class="bg-primary/40 h-2 w-2 animate-bounce rounded-full"
					style="animation-delay: 300ms"
				></span>
			</div>
		</div>
	{:else}
		<h3 class="font-title text-secondary mb-1 text-2xl font-normal">Create an Account</h3>
		<p class="mb-1 text-sm tracking-wide text-gray-600">Then Create Your First Achievement</p>
		<p class="mb-1 text-sm tracking-wide text-gray-600">
			Start your 14-day free trial. Cancel any time.
		</p>
		<p class="mb-5 text-sm tracking-wide text-gray-600">
			Already have an account? <a
				onclick={() => trackingStore.trackAction('Go To Login Click')}
				href="/login"
				class=" text-primary inline"
			>
				Sign in here
			</a>
		</p>

		<form
			id="create-account"
			onsubmit={(e) => {
				e.preventDefault();
				trackingStore.trackAction('Register Account Submit', {
					has_first_name: !!firstName,
					has_email: !!email,
					has_password: !!password
				});
				login();
			}}
			class="space-y-3"
		>
			<TextInput
				id="firstName"
				label="First Name"
				bind:value={firstName}
				placeholder="Your First Name"
				autocomplete="given-name"
				errorText={errorText['firstName']}
				onblur={() => trackFieldFilled('first_name', firstName)}
			/>
			<TextInput
				id="email"
				label="Email"
				type="text"
				placeholder="Your Email"
				bind:value={email}
				autocomplete="email"
				required
				errorText={errorText['email']}
				onblur={() => trackFieldFilled('email', email)}
			/>
			<PasswordInput
				id="password"
				label="Password"
				bind:value={password}
				required
				autocomplete="new-password"
				onblur={() => trackFieldFilled('password', password)}
			/>
			<ErrorText errorText={errorText['password']} />
			<PasswordRequirements {password} />
			<p class="text-[10px] leading-relaxed text-gray-400">
				By creating an account you agree to our
				<a href="https://mycareerfingerprint.com/terms" class="hover:text-secondary underline"
					>Terms of Service</a
				>
				and
				<a href="https://mycareerfingerprint.com/privacy" class="hover:text-secondary underline"
					>Privacy Policy</a
				>.
			</p>
		</form>
	{/if}

	{#snippet actions()}
		{#if !accountCreated}
			<div class="flex w-full flex-col-reverse items-center justify-between gap-y-2 md:flex-row">
				{#if $registerUser.isPending}
					<button disabled class="btn btn-text--disabled btn-small" type="submit">
						Creating account...
					</button>
				{:else}
					<button
						onclick={() => trackingStore.trackAction('Register Click')}
						disabled={!hasRequired || isLoading}
						class="btn btn--primary md:btn-small w-full disabled:border-gray-500 disabled:bg-gray-500 disabled:opacity-50"
						type="submit"
						form="create-account"
					>
						Create account
					</button>
				{/if}
			</div>
		{/if}
	{/snippet}
</SplitCard>
