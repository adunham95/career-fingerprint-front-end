<script lang="ts">
	import Label, { type LabelProps } from './Label.svelte';

	interface Props extends LabelProps {
		name?: string;
		required?: boolean;
		value: string | undefined | null;
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
		class="text-theme-content placeholder:text-theme-secondary-content focus:ring-theme-brand block w-full rounded-md border-0 bg-white px-1.5 py-1.5 shadow-sm ring-1 ring-gray-300 ring-inset focus:ring-2 focus:ring-inset sm:text-[1.2rem] sm:leading-6"
	>
		{#each options as option}
			<option value={option.id} selected={option.selected || false}>
				{option?.label || option.id}
			</option>
		{/each}
	</select>
</div>
