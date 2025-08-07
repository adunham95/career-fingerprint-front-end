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
			<p class="text-base/7 font-semibold text-indigo-600">Elevate Your Career</p>
			<h2 class="mt-2 text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
				Thank you for signing up
			</h2>
			<p class="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
				Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.
				Elit sunt amet fugiat veniam occaecat fugiat.
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
				<span class="inline-flex rounded-lg bg-teal-50 p-3 text-teal-700 ring-4 ring-white">
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
							d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</span>
			</div>
			<div class="mt-8">
				<h3 class="text-base font-semibold text-gray-900">
					<a href="#" class="focus:outline-hidden">
						<!-- Extend touch target to entire panel -->
						<span aria-hidden="true" class="absolute inset-0"></span>
						Request time off
					</a>
				</h3>
				<p class="mt-2 text-sm text-gray-500">
					Doloribus dolores nostrum quia qui natus officia quod et dolorem. Sit repellendus qui ut
					at blanditiis et quo et molestiae.
				</p>
			</div>
			<span
				aria-hidden="true"
				class="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
			>
				<svg viewBox="0 0 24 24" fill="currentColor" class="size-6">
					<path
						d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z"
					/>
				</svg>
			</span>
		</div>
		<div
			class="group relative bg-white p-6 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-inset sm:rounded-tr-lg"
		>
			<div>
				<span class="inline-flex rounded-lg bg-purple-50 p-3 text-purple-700 ring-4 ring-white">
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
				<h3 class="text-base font-semibold text-gray-900">
					<a href="#" class="focus:outline-hidden">
						<!-- Extend touch target to entire panel -->
						<span aria-hidden="true" class="absolute inset-0"></span>
						Benefits
					</a>
				</h3>
				<p class="mt-2 text-sm text-gray-500">
					Doloribus dolores nostrum quia qui natus officia quod et dolorem. Sit repellendus qui ut
					at blanditiis et quo et molestiae.
				</p>
			</div>
			<span
				aria-hidden="true"
				class="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
			>
				<svg viewBox="0 0 24 24" fill="currentColor" class="size-6">
					<path
						d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z"
					/>
				</svg>
			</span>
		</div>

		<div
			class="group relative bg-white p-6 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-inset sm:rounded-bl-lg"
		>
			<div>
				<span class="inline-flex rounded-lg bg-rose-50 p-3 text-rose-700 ring-4 ring-white">
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
							d="M8.25 9.75h4.875a2.625 2.625 0 0 1 0 5.25H12M8.25 9.75 10.5 7.5M8.25 9.75 10.5 12m9-7.243V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185Z"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</span>
			</div>
			<div class="mt-8">
				<h3 class="text-base font-semibold text-gray-900">
					<a href="#" class="focus:outline-hidden">
						<!-- Extend touch target to entire panel -->
						<span aria-hidden="true" class="absolute inset-0"></span>
						Submit an expense
					</a>
				</h3>
				<p class="mt-2 text-sm text-gray-500">
					Doloribus dolores nostrum quia qui natus officia quod et dolorem. Sit repellendus qui ut
					at blanditiis et quo et molestiae.
				</p>
			</div>
			<span
				aria-hidden="true"
				class="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
			>
				<svg viewBox="0 0 24 24" fill="currentColor" class="size-6">
					<path
						d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z"
					/>
				</svg>
			</span>
		</div>
		<div
			class="group relative rounded-br-lg rounded-bl-lg bg-white p-6 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-inset sm:rounded-bl-none"
		>
			<div>
				<span class="inline-flex rounded-lg bg-indigo-50 p-3 text-indigo-700 ring-4 ring-white">
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
							d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</span>
			</div>
			<div class="mt-8">
				<h3 class="text-base font-semibold text-gray-900">
					<a href="#" class="focus:outline-hidden">
						<!-- Extend touch target to entire panel -->
						<span aria-hidden="true" class="absolute inset-0"></span>
						Training
					</a>
				</h3>
				<p class="mt-2 text-sm text-gray-500">
					Doloribus dolores nostrum quia qui natus officia quod et dolorem. Sit repellendus qui ut
					at blanditiis et quo et molestiae.
				</p>
			</div>
			<span
				aria-hidden="true"
				class="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
			>
				<svg viewBox="0 0 24 24" fill="currentColor" class="size-6">
					<path
						d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z"
					/>
				</svg>
			</span>
		</div>
	</div>
</PageContainer>
