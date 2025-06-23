<script lang="ts" module>
	export interface LabelProps {
		label?: string;
		subLabel?: string;
		id?: string;
		hideLabel?: boolean;
		labelClassName?: string;
	}
</script>

<script lang="ts">
	const { label = '', subLabel, id, hideLabel = false, labelClassName = '' }: LabelProps = $props();
</script>

<label
	for={id}
	class={`block text-sm leading-6 font-medium ${labelClassName} ${hideLabel ? 'sr-only' : ''}`}
>
	{label}
	{#if subLabel}
		<span class="block text-xs font-light">{subLabel}</span>
	{/if}
</label>
