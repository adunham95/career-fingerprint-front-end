<script lang="ts">
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import StepHeader from '../StepHeader.svelte';

	const { data } = $props();

	console.log({ data });
</script>

<!-- 
Questions
Additional Notes
-->

<PageContainer>
	<StepHeader currentStep={3} meetingID={data.meetingID || ''} />
	<div class="flex justify-end">
		<button class="btn btn--primary print:hidden" onclick={() => window.print()}>Print</button>
	</div>
	<div class="mx-auto max-w-3xl px-4 py-4 sm:px-6 sm:py-8 lg:px-8 print:w-full print:p-0">
		<p class="hidden print:block">Your Career Fingerprint Meeting Guild</p>
		<div class="max-w-xl">
			<p class="font-title mt-2 text-4xl font-bold tracking-tight sm:text-5xl print:text-2xl">
				Interview w/ Microsoft
			</p>
			<p class="mt-2 text-base text-gray-500">July 12 2025 2:30pm</p>
			<p class="mt-2 text-base text-gray-500">Engineering Manager | Microsoft</p>
		</div>
		<div class="mt-4">
			<h2 class="text-lg">Highlights</h2>
			<div
				class="mb-2 grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-300 pb-6 md:grid-cols-3 print:grid-cols-3"
			>
				<div>
					<h2 class="text-base/7 font-semibold text-gray-900">"Highlighted Text 1"</h2>
				</div>

				<div class=" gap-x-6 gap-y-8 md:col-span-2">
					<p>Note: This is note about text item 1</p>
					<ul>
						<li>I worked on a project</li>
						<li>I started a company</li>
					</ul>
				</div>
			</div>
			<div
				class="mb-2 grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-300 pb-6 md:grid-cols-3 print:grid-cols-3"
			>
				<div>
					<h2 class="text-base/7 font-semibold text-gray-900">"Highlighted Text 1"</h2>
				</div>

				<div class=" gap-x-6 gap-y-8 md:col-span-2">
					<p>Note: This is note about text item 1</p>
				</div>
			</div>
		</div>
		<div class="mt-4">
			<!-- <h2 class="text-lg">My Achievements</h2> -->
			<div class="grid grid-cols-3 gap-1">
				<div
					class="divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-600 bg-white"
				>
					<div class="px-2 py-2.5">This is my question</div>
					<div class="px-2 py-2.5">This is my answer</div>
				</div>
				<div
					class="divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-600 bg-white"
				>
					<div class="px-2 py-2.5">This is my question</div>
					<div class="px-2 py-2.5">This is my answer</div>
				</div>
				<div
					class="divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-800 bg-white"
				>
					<div class="px-2 py-2.5">This is my question</div>
					<div class="px-2 py-2.5">This is my answer</div>
				</div>
				<div
					class="divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-800 bg-white"
				>
					<div class="px-2 py-2.5">This is my question</div>
					<div class="px-2 py-2.5">This is my answer</div>
				</div>
				<div
					class="divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-800 bg-white"
				>
					<div class="px-2 py-2.5">This is my question</div>
					<div class="px-2 py-2.5">This is my answer</div>
				</div>
			</div>
		</div>
	</div>
</PageContainer>
