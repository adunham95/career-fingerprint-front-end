<script lang="ts">
	import { goto } from '$app/navigation';

	interface Props {
		options: { path: string; label: string }[];
	}

	const { options }: Props = $props();

	import { page } from '$app/state';

	const currentURL = $derived(page.url.pathname);

	function onChange(
		e: Event & {
			currentTarget: EventTarget & HTMLSelectElement;
		}
	) {
		if (e?.currentTarget?.value) goto(e.currentTarget.value);
	}
</script>

<div>
	<div class="grid grid-cols-1 sm:hidden">
		<select
			aria-label="Select a tab"
			class="col-start-1 row-start-1 mt-2 w-full appearance-none rounded-md bg-white py-2 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
			value={currentURL}
			onchange={(e) => onChange(e)}
		>
			{#each options as option}
				<option value={option.path}>{option.label}</option>
			{/each}
		</select>
		<svg
			class="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end fill-gray-500"
			viewBox="0 0 16 16"
			fill="currentColor"
			aria-hidden="true"
			data-slot="icon"
		>
			<path
				fill-rule="evenodd"
				d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
				clip-rule="evenodd"
			/>
		</svg>
	</div>
	<div class="hidden sm:block">
		<div class="border-b border-gray-200">
			<nav class="-mb-px flex" aria-label="Tabs">
				{#each options as option}
					{@render navItem(option.path, option.label, currentURL)}
				{/each}
			</nav>
		</div>
	</div>
</div>

{#snippet navItem(path: string, label: string, currentPath: string)}
	<a
		href={path}
		class={`w-1/4 border-b-2  px-1 py-4 text-center text-sm font-medium  ${currentPath.endsWith(path) ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}
	>
		{label}</a
	>
{/snippet}
