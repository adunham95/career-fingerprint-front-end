<script lang="ts">
	import Card from '$lib/Components/Containers/Card.svelte';
	import InlineTextInput from '$lib/Components/FormElements/InlineTextInput.svelte';
	import RadioCards from '$lib/Components/FormElements/RadioCards.svelte';
	import TextArea from '$lib/Components/FormElements/TextArea.svelte';
	import { trackingStore } from '$lib/Stores/tracking';
	import { onMount } from 'svelte';
	import { toastStore } from '$lib/Components/Toasts/toast';
	import { goto } from '$app/navigation';

	onMount(() => {
		trackingStore.pageViewEvent('Get Started');
	});

	function scrollToView(id: string) {
		const elm = document.getElementById(id);
		if (elm) elm.scrollIntoView({ behavior: 'smooth' });
	}

	let profile = $state({
		lookingFor: '',
		companyName: '',
		title: '',
		institution: '',
		degree: '',
		startDate: '',
		endDate: '',
		achievement: ''
	});

	let completedSteps = $state<string[]>([]);

	let steps = [
		{ title: 'Situation', key: 'situation' },
		{ title: 'First Position', key: 'position' },
		{ title: 'First Achievement', key: 'achievement' }
	];

	let currentStep = $state('situation');

	$inspect(steps.findIndex((s) => s.key === currentStep));

	function goToNextStep(currentStep: string) {}

	function setCurrentStep(stepKey: string) {
		currentStep = stepKey;
		scrollToView(stepKey);
	}

	function updateUser() {
		completedSteps.push('situation');
		setCurrentStep('position');
	}

	async function addNewResumeObject() {
		completedSteps.push('position');
		setCurrentStep('achievement');
	}

	async function addAchievement() {
		completedSteps.push('achievement');
		goto('/dashboard');
	}
</script>

<nav aria-label="Progress" class="mt-2 flex items-center justify-center lg:hidden">
	<p class="text-sm font-medium text-gray-900">
		Step {steps.findIndex((s) => s.key === currentStep) + 1 || 1} of {steps.length}
	</p>
	<ol role="list" class="ml-8 flex items-center space-x-5">
		{#each steps as step, idx}
			{@const hasCompletedStep = completedSteps.includes(step.key)}
			<!-- Completed Step -->
			<li>
				<button
					onclick={() => setCurrentStep(step.key)}
					class={`block size-2.5 rounded-full ${hasCompletedStep ? 'bg-primary hover:bg-primary-700' : 'bg-gray-200 hover:bg-gray-400'}`}
				>
					{#if currentStep === step.key}
						<span aria-hidden="true" class="bg-primary-700 relative block size-2.5 rounded-full"
						></span>
					{/if}
					<span class="sr-only">{step.title}</span>
				</button>
			</li>
		{/each}
	</ol>
</nav>

<div class="mx-auto flex w-full max-w-7xl items-start gap-x-8 px-4 py-10 sm:px-6 lg:px-8">
	<aside class="sticky top-8 hidden w-[200px] shrink-0 lg:block">
		<div class="px-4 py-12 sm:px-6 lg:px-8">
			<nav aria-label="Progress" class="flex justify-center">
				<ol role="list" class="space-y-6">
					{#each steps as step, idx}
						{@const hasCompletedStep = completedSteps.includes(step.key)}

						<li>
							<button onclick={() => setCurrentStep(step.key)} class="group">
								<span class="flex items-start">
									<div class="relative flex size-5 shrink-0 items-center justify-center">
										{#if hasCompletedStep}
											<svg
												viewBox="0 0 20 20"
												fill="currentColor"
												data-slot="icon"
												aria-hidden="true"
												class="text-primary group-hover:text-primary-800 size-full"
											>
												<path
													d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
													clip-rule="evenodd"
													fill-rule="evenodd"
												/>
											</svg>
										{:else if currentStep === step.key}
											<span class="bg-primary-200 absolute size-4 rounded-full"></span>
											<div class="bg-primary-600 relative block size-2 rounded-full"></div>
										{:else}
											<div class="size-2 rounded-full bg-gray-300 group-hover:bg-gray-400"></div>
										{/if}
									</div>
									<span
										class="ml-3 text-left text-sm font-medium text-gray-500 group-hover:text-gray-900"
									>
										{step.title}
									</span>
								</span>
							</button>
						</li>
					{/each}
					<li>
						<a href="/dashboard" class="btn btn-text--primary text-xs">Skip</a>
					</li>
				</ol>
			</nav>
		</div>
	</aside>

	<main class="flex-1">
		<form
			id="situation"
			class="flex min-h-screen flex-col items-center justify-center"
			onsubmit={(e) => {
				e.preventDefault();
				updateUser();
			}}
		>
			<Card>
				<h3 class="font-title pb-4 text-lg">
					Which of these best describes your current situation?
				</h3>
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
				{#snippet actions()}
					<button class="btn btn--primary" type="submit">Continue</button>
				{/snippet}
			</Card>
		</form>
		<div id="position" class="flex min-h-screen flex-col items-center justify-center">
			<Card>
				<h3 class="font-title pb-4 text-lg">Introduce Yourself</h3>
				<div class={profile.lookingFor === 'growing' ? 'block' : 'hidden'}>
					I work at <InlineTextInput
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
					I worked at <InlineTextInput
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
					I've been studying <InlineTextInput
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
				{#snippet actions()}
					<button class="btn btn--primary" type="submit">Continue</button>
				{/snippet}
			</Card>
		</div>
		<div id="achievement" class="flex min-h-screen flex-col items-center justify-center">
			<Card>
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
				{#snippet actions()}
					<button class="btn btn--primary" type="submit">Continue</button>
				{/snippet}
			</Card>
		</div>

		<div id="finish" class="flex min-h-screen flex-col items-center justify-center">
			<Card>
				<h3 class="font-title pb-4 text-lg">
					Tell us one thing you’re proud of from your time at {profile.institution ||
						profile.companyName}.
				</h3>

				{#snippet actions()}
					<button class="btn btn--primary" type="submit">Go To My Dashboard</button>
				{/snippet}
			</Card>
		</div>
	</main>
</div>
