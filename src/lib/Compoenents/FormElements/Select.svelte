<script lang="ts">
	import Label, { type LabelProps } from './Label.svelte';

	interface Props extends LabelProps {
		name?: string;
		required?: boolean;
		value: string;
		className?: string;
		checkItemClassName?: string;
		options?: { id: string; label?: string; selected?: boolean }[];
	}

	let {
		label,
		id,
		required,
		value = $bindable(),
		name,
		className,
		options = [],
		hideLabel,
		labelClassName,
		...props
	}: Props = $props();
</script>

<div class={className}>
	{#if label}
		<Label {label} {id} {hideLabel} {labelClassName} />
	{/if}
	<select
		{required}
		name={name || id}
		bind:value
		class="block bg-white w-full rounded-md border-0 px-1.5 py-1.5 text-theme-content shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-theme-secondary-content focus:ring-2 focus:ring-inset focus:ring-theme-brand sm:text-[1.2rem] sm:leading-6"
	>
		{#each options as option}
			<option value={option.id} selected={option.selected || false}>
				{option?.label || option.id}
			</option>
		{/each}
	</select>
</div>
