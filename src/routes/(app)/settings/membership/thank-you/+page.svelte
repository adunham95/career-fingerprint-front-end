<script>
	import { invalidateAll } from '$app/navigation';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import { trackingStore } from '$lib/Stores/tracking';
	import { onMount } from 'svelte';

	onMount(() => {
		invalidateAll();
		trackingStore.pageViewEvent('Membership Sign Up Thank You');
	});
</script>

<PageContainer>
	<div class="py-12">
		<div class="mx-auto max-w-2xl text-center">
			<p class="text-primary text-base/7 font-semibold">Elevate Your Career</p>
			<h2 class="mt-2 text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
				Thank you for signing up
			</h2>
			<p class="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
				You now have to access to more features
			</p>
		</div>
	</div>
	<div
		class="mb-8 divide-y divide-gray-200 overflow-hidden rounded-lg bg-gray-200 shadow-sm sm:grid sm:grid-cols-2 sm:gap-px sm:divide-y-0"
	>
		<div
			class="group relative rounded-tl-lg rounded-tr-lg bg-white p-6 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-inset sm:rounded-tr-none"
		>
			<div>
				<span
					class="bg-pastel-blue-400 text-pastel-blue-800 inline-flex rounded-lg p-3 ring-4 ring-white"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6"
						/>
					</svg>
				</span>
			</div>
			<div class="mt-8">
				<h3 class="text-base font-semibold text-gray-900">Meeting CheatSheet</h3>
				<p class="mt-2 text-sm text-gray-500">
					Access a cheatsheet to have quick access to your achievements, current jobs, and other
					interview prep
				</p>
			</div>
		</div>
		<div
			class="group relative bg-white p-6 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-inset sm:rounded-tr-lg"
		>
			<div>
				<span
					class="bg-pastel-purple-400 text-pastel-purple-800 inline-flex rounded-lg p-3 ring-4 ring-white"
				>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						data-slot="icon"
						aria-hidden="true"
						class="size-6"
					>
						<path
							d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</span>
			</div>
			<div class="mt-8">
				<h3 class="text-base font-semibold text-gray-900">Meeting Prep</h3>
				<p class="mt-2 text-sm text-gray-500">
					Prep for you meetings. Highlight important aspects of you application, or agenda. And
					review your cheatsheet.
				</p>
			</div>
		</div>
	</div>
</PageContainer>
