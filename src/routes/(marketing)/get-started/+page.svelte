<script>
	import CheckCards from '$lib/Compoenents/FormElements/CheckCards.svelte';
	import InlineTextInput from '$lib/Compoenents/FormElements/InlineTextInput.svelte';
	import TextArea from '$lib/Compoenents/FormElements/TextArea.svelte';
	import TextInput from '$lib/Compoenents/FormElements/TextInput.svelte';
</script>

<div class="mx-auto max-w-2xl px-3 py-3">
	<!-- Step 1 -->
	<div id="step-1" class="flex min-h-screen flex-col items-center justify-center">
		<h2 class="font-title pb-2 text-3xl">Welcome to Career Fingerprint!</h2>
		<h3 class="font-title text-lg">
			We’re here to help you build your unique career story — and we’re glad you’re here
		</h3>
		<div class="flex justify-end py-2">
			<button class="btn btn--primary">Lets Get Started</button>
		</div>
	</div>

	<!-- Step 2 -->
	<div id="step-2" class="flex min-h-screen flex-col items-center justify-center">
		<h3 class="font-title pb-4 text-lg">Which of these best describes your current situation?</h3>
		<CheckCards
			wrapperClass="sm:grid-cols-2"
			value=""
			groupName="currentRole"
			options={[
				{ id: 'current', label: 'Currently Employed' },
				{ id: 'student', label: 'Student' },
				{ id: 'between', label: 'Between Roles' }
			]}
		/>
		<div class="flex justify-end pt-2">
			<button class="btn btn--primary">Continue</button>
		</div>
	</div>

	<!-- Step 3 -->
	<div id="step-3" class="flex min-h-screen flex-col items-center justify-center">
		<h3 class="font-title pb-4 text-lg">Introduce Yourself</h3>
		<p>
			Hello, my name is <InlineTextInput
				id="firstName"
				label="First name"
				placeholder="Adrian"
				value=""
			/> and I work at <InlineTextInput
				id="companyName"
				label="Company Name"
				placeholder="Google"
				value=""
			/> since <InlineTextInput id="month" label="Month" value="" type="date" width={130} />
		</p>
		<div class="flex justify-end pt-2">
			<button class="btn btn--primary">Continue</button>
		</div>
	</div>

	<!-- Step 4 -->
	<div id="step-4" class="flex min-h-screen flex-col items-center justify-center">
		<h3 class="font-title pb-4 text-lg">
			Tell us one thing you’re proud of from your time at [Company/School Name].
		</h3>
		<TextArea
			className="w-full max-w-2xl"
			id="tellus"
			placeholder="E.g., Led a team project, built a new system, mentored a junior, etc."
		/>
		<div class="flex justify-end pt-2">
			<button class="btn btn--primary">Continue</button>
		</div>
	</div>

	<!-- Step 5 -->
	<div id="step-5" class="flex min-h-screen flex-col items-center justify-center">
		<h3 class="font-title pb-2 text-lg">Create Your Account</h3>
		<p class="pb-4">Save your progress and access it anytime.</p>
		<div>
			<TextInput id="email" label="Email" type="email" />
			<TextInput id="password" label="Password" />
		</div>
		<div class="flex justify-end pt-2">
			<button class="btn btn--primary">Create Account</button>
		</div>
	</div>

	<!-- Step 5 -->
	<div id="step-5" class="flex min-h-screen flex-col items-center justify-center">
		<h3 class="font-title pb-2 text-lg">Want free CareerFingerprint stickers?</h3>
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
			<button class="btn btn-text--secondary">I dont want stickers</button>
			<button class="btn btn--primary">Claim my stickers!</button>
		</div>
	</div>

	<!-- Step 6 -->
	<div id="step-6" class="flex min-h-screen flex-col items-center justify-center">
		<h3 class="font-title pb-2 text-lg">Go Premium</h3>
		<p class="pb-4">Unlock additional features when building your fingerprint</p>

		<div class="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 md:max-w-2xl md:grid-cols-2">
			<div class="bg-surface-100 rounded-3xl p-8 ring-1 ring-gray-200">
				<h3 id="tier-hobby" class="text-lg/8 font-semibold text-gray-900">Starter</h3>
				<p class="mt-4 text-sm/6 text-gray-600">Perfect for students and early professionals</p>
				<p class="mt-6 flex items-baseline gap-x-1">
					<span class="text-4xl font-semibold tracking-tight text-gray-900">Free</span>
				</p>
				<button class="btn btn-outline--primary mt-2 w-full">Continue with basic account</button>
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
			<div class="bg-surface-100 rounded-3xl p-8 ring-1 ring-gray-200">
				<h3 id="tier-freelancer" class="text-lg/8 font-semibold text-gray-900">Elevate</h3>
				<p class="mt-4 text-sm/6 text-gray-600">For active professionals and job switchers</p>
				<p class="mt-6 flex items-baseline gap-x-1">
					<span class="text-4xl font-semibold tracking-tight text-gray-900">$9.99</span>
					<span class="text-sm/6 font-semibold text-gray-600">/month</span>
				</p>
				<button class="btn btn-outline--primary mt-2 w-full">Upgrade account</button>
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
		</div>
	</div>
</div>
