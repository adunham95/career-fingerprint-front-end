<script lang="ts">
	import type { LabelProps } from './Label.svelte';
	import Label from './Label.svelte';

	interface Props extends LabelProps {
		id: string;
		className?: string;
		errorText?: string;
		value: string;
		onChange?: (e: string) => void;
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
	<input
		{id}
		oninput={(e) => onChange?.(e.currentTarget.value)}
		type="text"
		bind:value
		class="focus:outline-primary block w-full rounded-md bg-white py-1.5 pr-12 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6"
	/>
</div>
