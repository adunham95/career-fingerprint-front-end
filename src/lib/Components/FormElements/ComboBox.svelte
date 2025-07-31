<script lang="ts">
	import type { LabelProps } from './Label.svelte';
	import Label from './Label.svelte';

	interface Props extends LabelProps {
		id: string;
		className?: string;
		errorText?: string;
		value: string;
		onChange?: () => void;
	}

	let {
		id,
		label,
		hideLabel,
		className = '',
		labelClassName,
		value = $bindable(),
		errorText,
		onChange,
		...props
	}: Props = $props();
</script>

<div class={`${className}`}>
	<Label {id} {label} {hideLabel} {labelClassName} />
	<el-autocomplete class="relative mt-2 block">
		<input
			{id}
			onchange={onChange}
			type="text"
			bind:value
			class="focus:outline-primary block w-full rounded-md bg-white py-1.5 pr-12 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6"
		/>
		<button type="button" class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2">
			<svg
				viewBox="0 0 20 20"
				fill="currentColor"
				data-slot="icon"
				aria-hidden="true"
				class="size-5 text-gray-400"
			>
				<path
					d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
					clip-rule="evenodd"
					fill-rule="evenodd"
				/>
			</svg>
			<span class="sr-only">Open Options</span>
		</button>

		<el-options
			anchor="bottom end"
			popover
			class="max-h-60 w-(--input-width) overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 transition-discrete [--anchor-gap:--spacing(1)] data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm"
		>
			<el-option
				value="Leslie Alexander"
				class="block truncate px-3 py-2 text-gray-900 select-none aria-selected:bg-indigo-600 aria-selected:text-white"
				>Leslie Alexander</el-option
			>
			<el-option
				value="Michael Foster"
				class="block truncate px-3 py-2 text-gray-900 select-none aria-selected:bg-indigo-600 aria-selected:text-white"
				>Michael Foster</el-option
			>
		</el-options>
	</el-autocomplete>
</div>
