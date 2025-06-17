<script lang="ts">
	import Label, { type LabelProps } from './Label.svelte';

	interface Props extends LabelProps {
		name?: string;
		required?: boolean;
		checked?: boolean;
		className?: string;
		checkItemClassName?: string;
	}

	let {
		label,
		id,
		required,
		checked = $bindable(false),
		name,
		className,
		checkItemClassName = ''
	}: Props = $props();
</script>

<div class={`flex items-center ${className}`}>
	{#if label}
		<Label {label} {id} labelClassName="pr-4" />
	{/if}

	<label
		for={id}
		class={`bg-gray-200 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 has-[:checked]:ring-theme-brand has-[:checked]:bg-blue-500 ${checkItemClassName}`}
	>
		<input
			hidden
			{id}
			{required}
			bind:checked
			name={name || id}
			type="checkbox"
			class="peer sr-only"
		/>
		<span
			aria-hidden="true"
			class="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out peer-[:checked]:translate-x-5"
		></span>
	</label>
</div>
