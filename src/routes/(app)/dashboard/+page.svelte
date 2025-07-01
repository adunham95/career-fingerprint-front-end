<script>
	import Calender from '$lib/Components/Calender/Calender.svelte';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import Drawer from '$lib/Components/Overlays/Drawer.svelte';

	let { data } = $props();

	let isOpen = $state(false);
</script>

<PageContainer className="py-6">
	<p class="font-title text-4xl">Hello, {data.user.firstName}</p>
	<div class="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4">
		<div
			class="relative flex aspect-square w-full cursor-pointer items-center justify-center rounded-lg border-2 border-green-600 bg-green-600/10 p-2 text-center transition hover:border-green-900 hover:bg-green-600/40 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden md:aspect-video"
		>
			<div class="flex flex-col items-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-8"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
					/>
				</svg>

				<p>Add Achievement</p>
				<p class=" text-xs">Take note of your achievements</p>
			</div>
		</div>
		<a
			href="/interview/cheatsheet"
			class="relative flex aspect-square w-full cursor-pointer items-center justify-center rounded-lg border-2 border-sky-600 bg-sky-600/10 p-2 text-center transition hover:border-sky-900 hover:bg-sky-600/50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden md:aspect-video"
		>
			<div class="flex flex-col items-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-8"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6"
					/>
				</svg>

				<p>Start Interview</p>
				<p class=" text-xs">Quickly access your cheatsheet</p>
			</div>
		</a>
		<div
			class="relative flex aspect-square w-full cursor-pointer items-center justify-center rounded-lg border-2 border-violet-600 bg-violet-600/10 p-2 text-center transition hover:border-violet-900 hover:bg-violet-600/50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden md:aspect-video"
		>
			<div class="flex flex-col items-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-8"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
					/>
				</svg>

				<p>Download Achievements</p>
				<p class=" text-xs">Prepare your 1:1 or Review</p>
			</div>
		</div>
		<div
			class="relative flex aspect-square w-full cursor-pointer items-center justify-center rounded-lg border-2 border-fuchsia-600 bg-fuchsia-600/10 p-2 text-center hover:border-fuchsia-900 hover:bg-fuchsia-600/50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden md:aspect-video"
		>
			TBD
		</div>
	</div>

	<div class="mt-3 grid grid-cols-1 grid-rows-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
		<div class="bg-surface-100 row-span-2 rounded border border-gray-200 p-2 md:col-span-2">
			Hello World
		</div>

		<div class="bg-surface-100 rounded border border-gray-200 p-2 md:col-span-2">
			<div class="flex items-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
					class="mr-1 size-6"
				>
					<path
						fill-rule="evenodd"
						d="M7.5 5.25a3 3 0 0 1 3-3h3a3 3 0 0 1 3 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0 1 12 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 0 1 7.5 5.455V5.25Zm7.5 0v.09a49.488 49.488 0 0 0-6 0v-.09a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 1.5 1.5Zm-3 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
						clip-rule="evenodd"
					/>
					<path
						d="M3 18.4v-2.796a4.3 4.3 0 0 0 .713.31A26.226 26.226 0 0 0 12 17.25c2.892 0 5.68-.468 8.287-1.335.252-.084.49-.189.713-.311V18.4c0 1.452-1.047 2.728-2.523 2.923-2.12.282-4.282.427-6.477.427a49.19 49.19 0 0 1-6.477-.427C4.047 21.128 3 19.852 3 18.4Z"
					/>
				</svg>

				<p>Projects</p>
			</div>
		</div>
		<div class="bg-surface-100 rounded border border-gray-200 p-2 md:col-span-2">
			<div class="flex items-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
					class="mr-1 size-6"
				>
					<path
						fill-rule="evenodd"
						d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z"
						clip-rule="evenodd"
					/>
				</svg>
				<p>Calender</p>
			</div>
			<Calender disableSelectedDays />
		</div>
	</div>
</PageContainer>

<button
	onclick={() => (isOpen = !isOpen)}
	class="rounded-md bg-gray-950/5 px-2.5 py-1.5 text-sm font-semibold text-gray-900 hover:bg-gray-950/10"
	>Open drawer</button
>

<Drawer bind:isOpen title="Add Achievement" subTitle="Add an a achievement here">
	<h1>Hello world</h1>
</Drawer>
