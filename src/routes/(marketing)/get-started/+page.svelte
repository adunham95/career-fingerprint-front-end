<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { useOrg } from '$lib/API/org';
	import { useRegisterUserMutation } from '$lib/API/user';
	import InlineTextInput from '$lib/Components/FormElements/InlineTextInput.svelte';
	import RadioCards from '$lib/Components/FormElements/RadioCards.svelte';
	import TextArea from '$lib/Components/FormElements/TextArea.svelte';
	import TextInput from '$lib/Components/FormElements/TextInput.svelte';
	import { toastStore } from '$lib/Components/Toasts/toast';
	import { trackingStore } from '$lib/Stores/tracking';
	import { onMount } from 'svelte';

	const orgID = page.url.searchParams.get('org') || undefined;

	function scrollToView(id: string) {
		const elm = document.getElementById(id);
		if (elm) elm.scrollIntoView({ behavior: 'smooth' });
	}

	let registerUser = useRegisterUserMutation();
	let org = useOrg(orgID || undefined);

	onMount(() => {
		trackingStore.pageViewEvent('Get Started');
	});

	let profile = $state({
		lookingFor: '',
		firstName: '',
		lastName: '',
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

	async function createAccount() {
		if (!profile.email || !profile.firstName || !profile.password) {
			toastStore.show({ message: 'Missing account elements', type: 'error' });
			return;
		}

		try {
			const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
			await $registerUser.mutateAsync({ ...profile, orgID, timezone });
			toastStore.show({
				type: 'success',
				message: `User saved`
			});
			window.dataLayer = window.dataLayer || [];
			window.dataLayer.push({
				event: 'sign_up_success'
			});
			goto('/dashboard');
		} catch (error) {
			toastStore.show({
				type: 'error',
				message: `Error updating User`
			});
		}
	}
</script>

<div class="mx-auto max-w-4xl px-3 py-3">
	<!-- Step 1 -->
	<div id="step-1" class="flex min-h-screen flex-col items-center justify-center">
		{#if $org?.data?.logoURL}
			<img src={$org.data.logoURL} alt={`${$org?.data?.name} Logo`} />
		{/if}
		<div>
			<h3 class="font-title text-md pb-2">
				{$org?.data?.name || ''}
			</h3>
		</div>

		<h2 class="font-title pb-2 text-3xl">Welcome to Career Fingerprint!</h2>
		<h3 class="font-title text-lg">
			We’re here to help you build your unique career story — and we’re glad you’re here
		</h3>
		<div class="flex justify-end py-2">
			<button
				type="button"
				class="btn btn--primary"
				onclick={() => {
					scrollToView('current-situation');
					trackingStore.trackAction('Next Step Click', { step: 'Get Started' });
				}}>Lets Get Started</button
			>
		</div>
	</div>

	<!-- Step 2 -->
	<form
		id="current-situation"
		class="flex min-h-screen flex-col items-center justify-center"
		onsubmit={(e) => {
			e.preventDefault();
			scrollToView('introduction');
			trackingStore.trackAction('Next Step Click', {
				step: 'Current Situation',
				currentSituation: profile.lookingFor
			});
		}}
	>
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
			<button class="btn btn--primary" type="submit">Continue</button>
		</div>
	</form>

	<!-- Step 3 -->
	<form
		id="introduction"
		class="flex min-h-screen flex-col items-center justify-center"
		onsubmit={(e) => {
			e.preventDefault();
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
		<h3 class="font-title pb-4 text-lg">Introduce Yourself</h3>
		<div class={profile.lookingFor === 'growing' ? 'block' : 'hidden'}>
			Hello, my name is <InlineTextInput
				id="firstName-growing"
				label="First name"
				placeholder="First Name"
				bind:value={profile.firstName}
			/>
			<InlineTextInput
				id="lastName-growing"
				label="Last name"
				placeholder="Last Name"
				bind:value={profile.lastName}
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
		</div>
		<div class={profile.lookingFor === 'job' ? 'block' : 'hidden'}>
			Hello, my name is <InlineTextInput
				id="firstName-job"
				label="First name"
				placeholder="First Name"
				bind:value={profile.firstName}
			/>
			<InlineTextInput
				id="lastName-job"
				label="Last name"
				placeholder="Last Name"
				bind:value={profile.lastName}
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
		</div>
		<div class={profile.lookingFor === 'student' ? 'block' : 'hidden'}>
			Hello, my name is <InlineTextInput
				id="firstName-student"
				label="First name"
				placeholder="Last Name"
				bind:value={profile.firstName}
			/>
			<InlineTextInput
				id="lastName-student"
				label="Last name"
				placeholder="Last Name"
				bind:value={profile.lastName}
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
		</div>

		<div class="flex justify-end pt-2">
			<button class="btn btn--primary" type="submit"> Continue</button>
		</div>
	</form>

	<!-- Step 4 -->
	<form
		id="achievement"
		class="flex min-h-screen flex-col items-center justify-center"
		onsubmit={(e) => {
			e.preventDefault();
			scrollToView('account');
			trackingStore.trackAction('Next Step Click', {
				step: 'Achievement',
				achievementFilledOut: profile.achievement !== ''
			});
		}}
	>
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
			<button class="btn btn--primary" type="submit"> Continue </button>
		</div>
	</form>

	<!-- Step 5 -->
	<form
		id="account"
		class="flex min-h-screen flex-col items-center justify-center"
		onsubmit={(e) => {
			e.preventDefault();
			createAccount();
		}}
	>
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
				type="submit"
				class="btn btn--primary"
				disabled={$registerUser.isPending}
				onclick={() => {
					trackingStore.trackAction('Next Step Click', {
						step: 'Create Account'
					});
				}}
			>
				Create Account
			</button>
		</div>
	</form>
</div>
