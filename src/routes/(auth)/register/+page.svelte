<script lang="ts">
	import { goto, preloadCode } from '$app/navigation';
	import SplitCard from '$lib/Components/Containers/SplitCard.svelte';
	import BannerError from '$lib/Components/FormElements/BannerError.svelte';
	import ErrorText from '$lib/Components/FormElements/ErrorText.svelte';
	import PasswordInput from '$lib/Components/FormElements/PasswordInput.svelte';
	import TextInput from '$lib/Components/FormElements/TextInput.svelte';
	import { trackingStore } from '$lib/Stores/tracking';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import AuthValueProps from '../authValueProps.svelte';
	import GoogleSignIn from '$lib/Components/Buttons/GoogleSignIn.svelte';
	import LinkedinLogin from '$lib/Components/Buttons/LinkedinLogin.svelte';
	import { PUBLIC_GOOGLE_LOGIN_ENABLED, PUBLIC_LINKEDIN_LOGIN_ENABLED } from '$env/static/public';
	import { authClient } from '$lib/auth-client';
	import { classifyError } from '$lib/errors';
	import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
	import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
	import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en';

	zxcvbnOptions.setOptions({
		dictionary: {
			...zxcvbnCommonPackage.dictionary,
			...zxcvbnEnPackage.dictionary
		},
		graphs: zxcvbnCommonPackage.adjacencyGraphs,
		translations: zxcvbnEnPackage.translations
	});

	const STRENGTH_MIN_SCORE = 2;

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

	let email = $state('');
	let password = $state('');
	let firstName = $state('');
	let isLoading = $state(false);
	let accountCreated = $state(false);
	let errorText = $state<{ [key: string]: string }>({});
	let bannerError = $state<string | null>(null);
	let hasRequired = $derived(!!email && !!password);
	let timesSubmitted = 0;

	let strengthResult = $state<ReturnType<typeof zxcvbn> | null>(null);
	let strengthScore = $derived(strengthResult?.score ?? -1);
	let currentStrength = $derived(strengthScore >= 0 ? strengthMeta[strengthScore] : null);

	let strengthTimer: ReturnType<typeof setTimeout>;

	function handlePasswordBlur() {
		clearTimeout(strengthTimer);
		strengthTimer = setTimeout(() => {
			strengthResult = password ? zxcvbn(password) : null;
		}, 150);
	}

	const trackedFields = new Set<string>();

	function trackFieldFilled(field: string, value: string) {
		if (value && !trackedFields.has(field)) {
			trackedFields.add(field);
			trackingStore.trackAction('Register - Field Filled', {
				field
			});
		}
	}

	async function validateEmailOnBlur() {
		const trimmed = email.trim().toLowerCase();
		email = trimmed;
		if (!trimmed) return;
		if (!isValidEmail(trimmed)) {
			errorText = { ...errorText, email: 'Please enter a valid email address.' };
			trackingStore.trackAction('Register - Validation Error', {
				field: 'email',
				reason: 'invalid_format',
				email_domain: trimmed.includes('@') ? trimmed.split('@')[1] : null,
				has_spaces: trimmed.includes(' '),
				has_plus: trimmed.includes('+'),
				char_count: trimmed.length.toString()
			});
			return;
		}

		const disposable = await isDisposableEmail(trimmed);
		if (disposable) {
			errorText = { ...errorText, email: 'Please use a permanent email address.' };
			trackingStore.trackAction('Register - Validation Error', {
				field: 'email',
				reason: 'disposable_email',
				email_domain: trimmed.split('@')[1]
			});
		} else {
			const { email: _removed, ...rest } = errorText;
			errorText = rest;
		}
	}

	const urlParams = new URLSearchParams(page.url.search || '');
	const redirectPath = urlParams.get('redirect') || '/onboard/achievement';

	onMount(() => {
		trackingStore.pageViewEvent('Register');
		trackingStore.trackSession();
	});

	function isValidEmail(value: string): boolean {
		if (value.includes(' ')) return false;
		const pattern = /^\S+@\S+\.\S+$/;
		return pattern.test(value);
	}

	async function isDisposableEmail(value: string): Promise<boolean> {
		const res = await fetch('/api/validate-email', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email: value })
		});
		const data = await res.json();
		return data.disposable === true;
	}

	async function register() {
		errorText = {};
		bannerError = null;
		timesSubmitted += 1;
		isLoading = true;
		email = email.trim().toLowerCase();

		if (!email) {
			errorText['email'] = 'Email is required.';
			trackingStore.trackAction('Register - Validation Error', {
				field: 'email',
				reason: 'required',
				email_domain: email.includes('@') ? email.split('@')[1] : null,
				has_spaces: email.includes(' '),
				has_leading_trailing_space: email !== email.trim(),
				has_plus: email.includes('+'),
				char_count: email.length.toString()
			});
		} else if (!isValidEmail(email)) {
			errorText['email'] = 'Please enter a valid email address.';
			trackingStore.trackAction('Register - Validation Error', {
				field: 'email',
				reason: 'invalid_format',
				email_domain: email.includes('@') ? email.split('@')[1] : null,
				has_spaces: email.includes(' '),
				has_leading_trailing_space: email !== email.trim(),
				has_plus: email.includes('+'),
				char_count: email.length.toString()
			});
		} else if (await isDisposableEmail(email)) {
			errorText['email'] = 'Please use a permanent email address.';
			trackingStore.trackAction('Register - Validation Error', {
				field: 'email',
				reason: 'disposable_email',
				email_domain: email.split('@')[1]
			});
		}

		if (password.length < 8) {
			errorText['password'] = 'Password must be at least 8 characters.';
			trackingStore.trackAction('Register - Password Validation Failed', {
				failing_requirements: 'too_short',
				password_strength: strengthResult?.toString() || '0',
				password_length: password.length.toString(),
				attempt_count: timesSubmitted.toString()
			});
		} else if (strengthScore < STRENGTH_MIN_SCORE) {
			errorText['password'] = 'Password is too weak. Try adding numbers, symbols, or more words.';
			trackingStore.trackAction('Register - Password Validation Failed', {
				failing_requirements: 'too_weak',
				strength_score: strengthScore.toString(),
				password_length: password.length.toString(),
				attempt_count: timesSubmitted.toString()
			});
		}

		if (Object.keys(errorText).length > 0) {
			isLoading = false;
			trackingStore.trackAction('Registered Account Validation Error', {
				error: JSON.stringify(errorText)
			});
			return;
		}

		try {
			const { data: newUser, error } = await authClient.signUp.email({
				email,
				password,
				name: firstName
			});

			if (error) {
				throw error;
			}

			trackingStore.identifyUser(String(newUser.user.id), newUser.user.email);
			trackingStore.trackAction('Registered Account Success');
			accountCreated = true;
			preloadCode(redirectPath);
			goto(redirectPath);

			isLoading = false;
		} catch (err: unknown) {
			const apiErr = err as { code?: string; message?: string };
			const { userMessage, field } = classifyError(apiErr?.code, apiErr?.message ?? String(err));
			if (field) {
				errorText[field] = userMessage;
			} else {
				bannerError = userMessage;
			}
			const errorMessage = apiErr?.message ?? String(err);
			trackingStore.trackAction('Registered Account Error', {
				error: errorMessage,
				email_domain: email.includes('@') ? email.split('@')[1] : null,
				has_spaces: email.includes(' '),
				has_leading_trailing_space: email !== email.trim(),
				has_plus: email.includes('+'),
				char_count: email.length.toString()
			});
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
			Start your limited free trial. Cancel any time.
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

		<BannerError message={bannerError} />

		<form
			id="create-account"
			onsubmit={(e) => {
				e.preventDefault();
				trackingStore.trackAction('Register Account Submit', {
					has_first_name: !!firstName,
					has_email: !!email,
					has_password: !!password
				});
				register();
			}}
			class="space-y-3"
		>
			<TextInput
				id="firstName"
				label="First Name"
				bind:value={firstName}
				placeholder="John"
				autocomplete="given-name"
				errorText={errorText['firstName']}
				onblur={() => trackFieldFilled('first_name', firstName)}
			/>
			<TextInput
				id="email"
				label="Email"
				type="email"
				placeholder="user@example.com"
				bind:value={email}
				autocomplete="email"
				required
				errorText={errorText['email']}
				aria-describedby="email-error"
				onblur={() => {
					trackFieldFilled('email', email);
					validateEmailOnBlur();
				}}
			/>
			<PasswordInput
				id="password"
				label="Password"
				bind:value={password}
				required
				autocomplete="new-password"
				ariaDescribedby="password-error"
				onblur={() => {
					trackFieldFilled('password', password);
					handlePasswordBlur();
				}}
			/>
			{#if password && currentStrength}
				<div class="mt-1.5 space-y-1" aria-live="polite">
					<div
						class="flex gap-1"
						role="img"
						aria-label="Password strength: {currentStrength.label}"
					>
						{#each [1, 2, 3, 4] as bar}
							<div
								class="h-1 flex-1 rounded-full transition-colors duration-200 {bar <=
								currentStrength.bars
									? currentStrength.color
									: 'bg-gray-200'}"
							></div>
						{/each}
					</div>
					<p class="text-xs {currentStrength.textColor}">{currentStrength.label}</p>
				</div>
			{/if}
			<ErrorText id="password-error" errorText={errorText['password']} />

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
				{#if isLoading}
					<button disabled class="btn btn-text--disabled btn-small" type="submit">
						Creating account...
					</button>
				{:else}
					<button
						onclick={() => trackingStore.trackAction('Register Click')}
						disabled={!hasRequired || isLoading}
						class="btn btn--primary md:btn-small w-full disabled:cursor-not-allowed disabled:border-gray-500 disabled:bg-gray-500 disabled:opacity-50"
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
