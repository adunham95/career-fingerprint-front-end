<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_API_URL } from '$env/static/public';
	import CheckCards from '$lib/Components/FormElements/CheckCards.svelte';
	import InlineTextInput from '$lib/Components/FormElements/InlineTextInput.svelte';
	import TextArea from '$lib/Components/FormElements/TextArea.svelte';
	import TextInput from '$lib/Components/FormElements/TextInput.svelte';
	import { toastStore } from '$lib/Components/Toasts/toast';

	function scrollToView(id: string) {
		const elm = document.getElementById(id);
		if (elm) elm.scrollIntoView({ behavior: 'smooth' });
	}

	let profile = $state({
		lookingFor: '',
		firstName: '',
		companyName: '',
		institution: '',
		degree: '',
		startDate: '',
		endDate: '',
		email: '',
		password: '',
		achievement: ''
	});

	let proPlan = $state({
		name: 'Pro Plan',
		priceCents: 999,
		interval: 'month',
		stripePriceID: null
	});

	async function createAccount() {
		const url = `${PUBLIC_API_URL}/register`;

		const res = await fetch(url, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json' // Set content type to JSON
			},
			body: JSON.stringify({
				...profile,
				startDate: profile.startDate ? new Date(profile.startDate).toISOString() : ''
			})
		});

		if (res.ok) {
			const data = await res.json();

			if (data?.plan) {
				proPlan = data.plan;
			}

			toastStore.show({
				type: 'success',
				message: `User saved`
			});
			scrollToView('stickers');
		} else {
			toastStore.show({
				type: 'error',
				message: `Error updating User`
			});
		}
	}

	async function startFreeTrial() {
		const url = `${PUBLIC_API_URL}/stripe/trial`;

		if (!proPlan.stripePriceID) {
			toastStore.show({
				type: 'error',
				message: `Error creating subscription`
			});
		}

		const res = await fetch(url, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json' // Set content type to JSON
			},
			body: JSON.stringify({
				priceID: proPlan.stripePriceID
			})
		});

		if (res.ok) {
			const data = await res.json();

			if (data?.plan) {
				proPlan = data.plan;
			}

			toastStore.show({
				type: 'success',
				message: `Free trial started`
			});
		} else {
			toastStore.show({
				type: 'error',
				message: `Error creating free trial`
			});
		}
		goto('/dashboard');
	}

	$inspect(profile);
</script>

<div class="mx-auto max-w-2xl px-3 py-3">
	<!-- Step 1 -->
	<div id="step-1" class="flex min-h-screen flex-col items-center justify-center">
		<h2 class="font-title pb-2 text-3xl">Welcome to Career Fingerprint!</h2>
		<h3 class="font-title text-lg">
			We’re here to help you build your unique career story — and we’re glad you’re here
		</h3>
		<div class="flex justify-end py-2">
			<button class="btn btn--primary" onclick={() => scrollToView('current-situation')}
				>Lets Get Started</button
			>
		</div>
	</div>

	<!-- Step 2 -->
	<div id="current-situation" class="flex min-h-screen flex-col items-center justify-center">
		<h3 class="font-title pb-4 text-lg">Which of these best describes your current situation?</h3>
		<CheckCards
			wrapperClass="sm:grid-cols-2"
			groupName="currentRole"
			options={[
				{ id: 'growing', label: 'Currently Employed' },
				{ id: 'student', label: 'Student' },
				{ id: 'job', label: 'Looking for a job' }
			]}
			bind:value={profile.lookingFor}
		/>
		<div class="flex justify-end pt-2">
			<button class="btn btn--primary" onclick={() => scrollToView('introduction')}>Continue</button
			>
		</div>
	</div>

	<!-- Step 3 -->
	<div id="introduction" class="flex min-h-screen flex-col items-center justify-center">
		<h3 class="font-title pb-4 text-lg">Introduce Yourself</h3>
		<p class={profile.lookingFor === 'growing' ? 'block' : 'hidden'}>
			Hello, my name is <InlineTextInput
				id="firstName-growing"
				label="First name"
				placeholder="Adrian"
				bind:value={profile.firstName}
			/> and I work at <InlineTextInput
				id="companyName-gowing"
				label="Company Name"
				placeholder="Google"
				bind:value={profile.companyName}
			/> since <InlineTextInput
				id="start-date-growing"
				label="Month"
				bind:value={profile.startDate}
				type="date"
				width={130}
			/>
		</p>
		<p class={profile.lookingFor === 'job' ? 'block' : 'hidden'}>
			Hello, my name is <InlineTextInput
				id="firstName-job"
				label="First name"
				placeholder="Adrian"
				bind:value={profile.firstName}
			/> and I worked at <InlineTextInput
				id="companyName-job"
				label="Company Name"
				placeholder="Google"
				bind:value={profile.companyName}
			/> from <InlineTextInput
				id="start-job"
				label="Starting Date"
				bind:value={profile.startDate}
				type="date"
				width={130}
			/> to
			<InlineTextInput
				id="end-job"
				label="Ending Date"
				bind:value={profile.endDate}
				type="date"
				width={130}
			/>
		</p>
		<p class={profile.lookingFor === 'student' ? 'block' : 'hidden'}>
			Hello, my name is <InlineTextInput
				id="firstName-student"
				label="First name"
				placeholder="Adrian"
				bind:value={profile.firstName}
			/> and I've been studying <InlineTextInput
				id="degree-student"
				label="Degree"
				placeholder="Business Administration"
				bind:value={profile.degree}
			/> at <InlineTextInput
				id="schoolName-student"
				label="School Name"
				placeholder="Harvard"
				bind:value={profile.institution}
			/> since <InlineTextInput
				id="start-student"
				label="Starting Date"
				bind:value={profile.startDate}
				type="date"
				width={130}
			/>
		</p>
		<!-- {/if} -->
		<div class="flex justify-end pt-2">
			<button class="btn btn--primary" onclick={() => scrollToView('achievement')}>
				Continue</button
			>
		</div>
	</div>

	<!-- Step 4 -->
	<div id="achievement" class="flex min-h-screen flex-col items-center justify-center">
		<h3 class="font-title pb-4 text-lg">
			Tell us one thing you’re proud of from your time at {profile.institution ||
				profile.companyName}.
		</h3>
		<TextArea
			className="w-full max-w-2xl"
			id="tellus"
			placeholder="E.g., Led a team project, built a new system, mentored a junior, etc."
			bind:value={profile.achievement}
		/>
		<div class="flex justify-end pt-2">
			<button class="btn btn--primary" onclick={() => scrollToView('account')}>Continue</button>
		</div>
	</div>

	<!-- Step 5 -->
	<div id="account" class="flex min-h-screen flex-col items-center justify-center">
		<h3 class="font-title pb-2 text-lg">Create Your Account</h3>
		<p class="pb-4">Save your progress and access it anytime.</p>
		<div>
			<TextInput id="email" label="Email" type="email" bind:value={profile.email} />
			<TextInput id="password" label="Password" bind:value={profile.password} />
		</div>
		<div class="flex justify-end pt-2">
			<button class="btn btn--primary" onclick={createAccount}>Create Account</button>
		</div>
	</div>

	<!-- Step 6 -->
	<div id="stickers" class="flex min-h-screen flex-col items-center justify-center">
		<h3 class="font-title pb-2 text-lg">Want free Career Fingerprint stickers?</h3>
		<p class="pb-4">
			Drop your mailing address and we’ll send you a small pack to celebrate your career journey!
		</p>
		<div class="grid w-full grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-3">
			<TextInput id="street" label="Street" className="sm:col-span-3" />
			<TextInput id="city" label="City" />
			<TextInput id="state" label="State / Province" />
			<TextInput id="postalCode" label="ZIP / Postal code" />
		</div>
		<div class="flex w-full flex-col justify-end gap-1.5 pt-2 sm:flex-row">
			<button class="btn btn-text--secondary" onclick={() => scrollToView('premium')}
				>I dont want stickers</button
			>
			<button class="btn btn--primary" onclick={() => scrollToView('premium')}
				>Claim my stickers!</button
			>
		</div>
	</div>

	<!-- Step 7 -->
	<div id="premium" class="flex min-h-screen flex-col items-center justify-center">
		<h3 class="font-title pb-2 text-lg">Go Premium</h3>
		<p class="pb-4">Unlock additional features when building your fingerprint</p>

		<div class="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 md:max-w-2xl md:grid-cols-2">
			<div class="bg-surface-100 rounded-3xl p-8 ring-1 ring-gray-200">
				<h3 id="tier-hobby" class="text-lg/8 font-semibold text-gray-900">Starter</h3>
				<p class="mt-4 text-sm/6 text-gray-600">Perfect for students and early professionals</p>
				<p class="mt-6 flex items-baseline gap-x-1">
					<span class="text-4xl font-semibold tracking-tight text-gray-900">Free</span>
				</p>
				<a href="/dashboard" class="btn btn-outline--primary mt-2 w-full"
					>Continue with basic account</a
				>
				<ul role="list" class="mt-8 space-y-3 text-sm/6 text-gray-600">
					<li class="flex gap-x-3">
						<svg
							class="text-primary h-6 w-5 flex-none"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true"
							data-slot="icon"
						>
							<path
								fill-rule="evenodd"
								d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
								clip-rule="evenodd"
							/>
						</svg>
						Basic Resume
					</li>
					<li class="flex gap-x-3">
						<svg
							class="text-primary h-6 w-5 flex-none"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true"
							data-slot="icon"
						>
							<path
								fill-rule="evenodd"
								d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
								clip-rule="evenodd"
							/>
						</svg>
						Manual Achievement Entry
					</li>
				</ul>
			</div>
			{#if proPlan.stripePriceID}
				<div class="bg-secondary ring-primary rounded-3xl p-8 shadow-2xl ring-2">
					<h3 id="tier-freelancer" class="text-lg/8 font-semibold text-gray-50">Elevate</h3>
					<p class="mt-4 text-sm/6 text-gray-200">For active professionals and job switchers</p>
					<p class="mt-6 flex items-baseline gap-x-1">
						<span class="text-4xl font-semibold tracking-tight text-gray-100">$9.99</span>
						<span class="text-sm/6 font-semibold text-gray-200">/month</span>
					</p>
					<button class="btn btn--primary mt-2 w-full" onclick={startFreeTrial}
						>Start Your Free Trial</button
					>
					<ul role="list" class="mt-8 space-y-3 text-sm/6 text-gray-200">
						<li class="flex gap-x-3">
							<svg
								class="text-primary h-6 w-5 flex-none"
								viewBox="0 0 20 20"
								fill="currentColor"
								aria-hidden="true"
								data-slot="icon"
							>
								<path
									fill-rule="evenodd"
									d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
									clip-rule="evenodd"
								/>
							</svg>
							Resume Editor
						</li>
						<li class="flex gap-x-3">
							<svg
								class="text-primary h-6 w-5 flex-none"
								viewBox="0 0 20 20"
								fill="currentColor"
								aria-hidden="true"
								data-slot="icon"
							>
								<path
									fill-rule="evenodd"
									d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
									clip-rule="evenodd"
								/>
							</svg>
							Weekly Achievement Reminders
						</li>
						<li class="flex gap-x-3">
							<svg
								class="text-primary h-6 w-5 flex-none"
								viewBox="0 0 20 20"
								fill="currentColor"
								aria-hidden="true"
								data-slot="icon"
							>
								<path
									fill-rule="evenodd"
									d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
									clip-rule="evenodd"
								/>
							</svg>
							Interview Prep Tools
						</li>
					</ul>
				</div>
			{/if}
		</div>
	</div>
</div>
