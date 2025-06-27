<script lang="ts">
	let span = $state<HTMLSpanElement | null>();

	interface Props {
		label: string;
		id: string;
		type?: 'text' | 'number' | 'date';
		value: string;
		placeholder?: string;
		width?: number;
		disabled?: boolean;
		textSize?: string;
		onblur?: () => void;
	}

	let {
		label,
		id,
		type = 'text',
		value = $bindable(''),
		placeholder,
		textSize = 'text-base',
		onblur
	}: Props = $props();
</script>

<div class="inputWidth overflow-hidden">
	<label for={id} class="sr-only">{label}</label>
	<div class="relative inline-block rounded font-sans">
		<span
			class={`font-inherit invisible absolute top-0 left-0 border border-transparent px-2 py-1 whitespace-pre ${textSize} inputWidth`}
			bind:this={span}
		>
			{value || placeholder || ' '}
		</span>
		<input
			{id}
			{type}
			bind:value
			oninput={() => (value = value)}
			class={`font-inherit overflow-hidden rounded border border-gray-300 px-2 py-1 focus:outline-none ${textSize} inputWidth `}
			style="width: {span?.offsetWidth}px"
			{placeholder}
			onblur={() => onblur?.()}
		/>
	</div>
</div>

<style>
	@media (max-width: 400px) {
		.inputWidth {
			max-width: calc(100vw - 30px);
		}
	}
</style>
