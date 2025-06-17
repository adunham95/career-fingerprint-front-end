<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	import Label from './Label.svelte';
	import type { LabelProps } from './Label.svelte';

	interface Props extends LabelProps, HTMLTextareaAttributes {
		id: string;
		className?: string;
		inputClassName?: string;
		errorText?: string;
	}

	let {
		id,
		label,
		hideLabel,
		className = '',
		inputClassName,
		labelClassName,
		value = $bindable(),
		name,
		errorText,
		...props
	}: Props = $props();
</script>

<div class={`${className}`}>
	<Label {id} {label} {hideLabel} {labelClassName} />
	<textarea
		{id}
		{...props}
		name={name || id}
		bind:value
		class={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 ${inputClassName}`}
	></textarea>
	{#if errorText}
		<p class="mt-2 text-sm text-red-600">{errorText}</p>
	{/if}
</div>
