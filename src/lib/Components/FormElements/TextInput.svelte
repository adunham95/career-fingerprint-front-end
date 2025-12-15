<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import Label from './Label.svelte';
	import type { LabelProps } from './Label.svelte';
	import type { Snippet } from 'svelte';

	interface Props extends LabelProps, HTMLInputAttributes {
		id: string;
		className?: string;
		inputClassName?: string;
		errorText?: string;
		preInlineAddOn?: Snippet;
		afterChildren?: Snippet;
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
		preInlineAddOn,
		afterChildren,
		...props
	}: Props = $props();
</script>

<div
	class={`${className} [fieldset:disabled_&]:pointer-events-none
  [fieldset:disabled_&]:opacity-50`}
>
	<Label {id} {label} {hideLabel} labelClassName={`${labelClassName}`} {subLabel} />
	<div>
		<input
			{id}
			{type}
			{...props}
			name={name || id}
			bind:value
			class={`focus:outline-primary focus:ring-primary bg-surface-100 block w-full rounded-md px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 disabled:opacity-50 disabled:ring-transparent disabled:outline-transparent sm:text-sm/6 ${inputClassName}`}
		/>
		{@render afterChildren?.()}
	</div>
	{#if errorText}
		<p class="mt-2 text-sm text-red-600">{errorText}</p>
	{/if}
</div>
