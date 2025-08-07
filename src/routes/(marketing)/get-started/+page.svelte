<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { useGetPlanByID } from '$lib/API/subscription';
	import InlineTextInput from '$lib/Components/FormElements/InlineTextInput.svelte';
	import RadioCards from '$lib/Components/FormElements/RadioCards.svelte';
	import TextArea from '$lib/Components/FormElements/TextArea.svelte';
	import TextInput from '$lib/Components/FormElements/TextInput.svelte';
	import { toastStore } from '$lib/Components/Toasts/toast';
	import { trackingStore } from '$lib/Stores/tracking';
	import { centsToDollars } from '$lib/Utils/centsToDollars';
	import { onMount } from 'svelte';

	function scrollToView(id: string) {
		const elm = document.getElementById(id);
		if (elm) elm.scrollIntoView({ behavior: 'smooth' });
	}

	let planKey = 'pro';

	let proData = useGetPlanByID(planKey);

	onMount(() => {
		trackingStore.pageViewEvent('Get Started');
	});

	$inspect($proData);

	let profile = $state({
		lookingFor: '',
		firstName: '',
		companyName: '',
		title: '',
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
		stripePriceID: 'price_1RncVuAmXvicwTzzvah0YuEX'
	});

	async function createAccount() {
		const url = `${PUBLIC_API_URL}/register`;

		if (!profile.email || !profile.firstName) {
			toastStore.show({ message: 'Missing account elements', type: 'error' });
		}

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

		console.log(res);

		if (res.ok) {
			const data = await res.json();

			// if (data?.plan) {
			// 	proPlan = data.plan;
			// }

			toastStore.show({
				type: 'success',
				message: `User saved`
			});
			// scrollToView('stickers');
			scrollToView('premium');
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
				priceID: $proData.data?.monthlyStripePriceID
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

<div class="mx-auto max-w-4xl px-3 py-3">
	<!-- Step 1 -->
	<div id="step-1" class="flex min-h-screen flex-col items-center justify-center">
		<h2 class="font-title pb-2 text-3xl">Welcome to Career Fingerprint!</h2>
		<h3 class="font-title text-lg">
			We’re here to help you build your unique career story — and we’re glad you’re here
		</h3>
		<div class="flex justify-end py-2">
			<button
				class="btn btn--primary"
				onclick={() => {
					scrollToView('current-situation');
					trackingStore.trackAction('Next Step Click', { step: 'Get Started' });
				}}>Lets Get Started</button
			>
		</div>
	</div>

	<!-- Step 2 -->
	<div id="current-situation" class="flex min-h-screen flex-col items-center justify-center">
		<h3 class="font-title pb-4 text-lg">Which of these best describes your current situation?</h3>
		<RadioCards
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
			<button
				class="btn btn--primary"
				onclick={() => {
					scrollToView('introduction');
					trackingStore.trackAction('Next Step Click', {
						step: 'Current Situation',
						currentSituation: profile.lookingFor
					});
				}}>Continue</button
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
				placeholder="First Name"
				bind:value={profile.firstName}
			/> and I work at <InlineTextInput
				id="companyName-gowing"
				label="Company Name"
				placeholder="Company"
				bind:value={profile.companyName}
			/> as <InlineTextInput
				id="jobTitle-gowing"
				label="Job Title"
				placeholder="Job Title"
				bind:value={profile.title}
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
				placeholder="First Name"
				bind:value={profile.firstName}
			/> and I worked at <InlineTextInput
				id="companyName-job"
				label="Company Name"
				placeholder="Company"
				bind:value={profile.companyName}
			/> as <InlineTextInput
				id="title-job"
				label="Job Title"
				placeholder="Job"
				bind:value={profile.title}
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
			<button
				class="btn btn--primary"
				onclick={() => {
					scrollToView('achievement');
					trackingStore.trackAction('Next Step Click', {
						step: 'Introduction',
						currentSituation: profile.lookingFor,
						firstNameFilledOut: profile.firstName !== '',
						companyFilledOut: profile.companyName !== '',
						titleFilledOut: profile.title !== '',
						startDateFilledOut: profile.startDate !== '',
						endDateFilledOut: profile.endDate !== '',
						degreeFilledOut: profile.degree !== '',
						institutionFilledOut: profile.institution !== ''
					});
				}}
			>
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
			<button
				class="btn btn--primary"
				onclick={() => {
					scrollToView('account');
					trackingStore.trackAction('Next Step Click', {
						step: 'Achievement',
						achievementFilledOut: profile.achievement !== ''
					});
				}}>Continue</button
			>
		</div>
	</div>

	<!-- Step 5 -->
	<div id="account" class="flex min-h-screen flex-col items-center justify-center">
		<h3 class="font-title pb-2 text-lg">Create Your Account</h3>
		<p class="pb-4">Save your progress and access it anytime.</p>
		<div class=" flex w-full max-w-[300px] flex-col">
			<TextInput
				className="w-full"
				inputClassName="w-full"
				id="email"
				label="Email"
				type="email"
				bind:value={profile.email}
				autocomplete="email"
			/>
			<TextInput
				id="password"
				label="Password"
				bind:value={profile.password}
				autocomplete="new-password"
			/>
		</div>
		<div class="flex justify-end pt-2">
			<button
				class="btn btn--primary"
				onclick={() => {
					createAccount();
					trackingStore.trackAction('Next Step Click', {
						step: 'Create Account'
					});
				}}>Create Account</button
			>
		</div>
	</div>

	<!-- Step 6 -->
	<!-- <div id="stickers" class="flex min-h-screen flex-col items-center justify-center">
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
				>I don't want stickers</button
			>
			<button class="btn btn--primary" onclick={() => scrollToView('premium')}
				>Claim my stickers!</button
			>
		</div>
	</div> -->

	<!-- Step 7 -->
	<div id="premium" class="flex min-h-screen flex-col items-center justify-center">
		<h3 class="font-title pb-2 text-lg">Go Premium</h3>
		<p class="pb-1">Unlock additional features when building your fingerprint</p>

		{#if $proData.data?.monthlyStripePriceID}
			<div
				class="bg-surface-50 mx-auto mt-8 w-full rounded-3xl ring-1 ring-gray-200 sm:mt-10 lg:mx-0 lg:flex lg:max-w-none"
			>
				<div class="p-8 sm:p-10 lg:flex-auto">
					<h3 class="text-3 font-semibold tracking-tight text-gray-900">{$proData.data.name}</h3>
					<p class="mt-6 text-base/7 text-gray-600">
						{$proData.data.description}
					</p>
					<div class="mt-5 flex items-center gap-x-4">
						<h4 class="text-primary flex-none font-semibold">What’s included</h4>
						<div class="h-px flex-auto bg-gray-300"></div>
					</div>
					<ul role="list" class="mt-8 grid grid-cols-1 gap-4 text-gray-600 sm:gap-6">
						{#each $proData.data.featureList as feature}
							<li class="flex gap-x-3">
								<svg
									viewBox="0 0 20 20"
									fill="currentColor"
									data-slot="icon"
									aria-hidden="true"
									class="text-primary h-6 w-5 flex-none"
								>
									<path
										d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
										clip-rule="evenodd"
										fill-rule="evenodd"
									/>
								</svg>
								{feature}
							</li>
						{/each}
					</ul>
				</div>
				<div class="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-sm lg:shrink-0">
					<div
						class="bg-surface-200 h-full rounded-2xl py-10 text-center ring-1 ring-gray-900/5 ring-inset lg:flex lg:flex-col lg:justify-center lg:py-16"
					>
						<div class="mx-auto max-w-xs px-8">
							<p class="mt-6 flex items-baseline justify-center gap-x-2">
								<span class="text-1 font-semibold tracking-tight text-gray-900"
									>${centsToDollars($proData.data.priceCents)}</span
								>
								<span class="text-4 font-semibold tracking-wide text-gray-600">/month</span>
							</p>
							<a
								href="/dashboard"
								class="btn btn--primary mt-10 block w-full"
								onclick={() =>
									trackingStore.trackAction('Next Step Click', {
										step: 'Go To Account'
									})}
							>
								Go To My Account
							</a>
							<!-- <button onclick={() => {startFreeTrial;
							 trackingStore.trackAction('Start Free Trial Click')}}} class="btn btn--primary mt-10 block w-full">
								Start my free trial
							</button> -->
						</div>
					</div>
				</div>
			</div>
			<div class="mt-2 flex w-full justify-end">
				<a
					href="/dashboard"
					onclick={() =>
						trackingStore.trackAction('Next Step Click', {
							step: 'Go To Account'
						})}
					class=" text-small btn btn-text--secondary btn-small">Continue without Premium Benefits</a
				>
			</div>
		{:else}
			<a
				href="/dashboard"
				class="btn btn--primary mt-10 block w-full"
				onclick={() =>
					trackingStore.trackAction('Next Step Click', {
						step: 'Go To Account'
					})}>Go to my account</a
			>
		{/if}
	</div>
</div>
