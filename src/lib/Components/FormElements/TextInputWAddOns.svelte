<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import Label, { type LabelProps } from './Label.svelte';

	interface Props extends LabelProps, HTMLInputAttributes {
		id: string;
		className?: string;
		inputClassName?: string;
		errorText?: string;
		preInlineText?: string;
	}

	let {
		id,
		label,
		hideLabel,
		subLabel,
		className = '',
		inputClassName,
		labelClassName,
		type = 'text',
		value = $bindable(),
		name,
		errorText,
		preInlineText,
		...props
	}: Props = $props();
</script>

<div class={`${className}`}>
	<Label {id} {label} {hideLabel} {labelClassName} {subLabel} />
	<div class="mt-2">
		<div
			class="focus-within:outline-primary flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2"
		>
			<div class="shrink-0 pr-1 text-base text-gray-500 select-none sm:text-sm/6">
				{preInlineText}
			</div>
			<input
				{id}
				{type}
				{...props}
				name={name || id}
				bind:value
				class="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
			/>
		</div>
	</div>
</div>
