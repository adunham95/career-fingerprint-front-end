<script lang="ts" module>
	export interface LabelProps {
		label?: string;
		subLabel?: string;
		id?: string;
		hideLabel?: boolean;
		labelClassName?: string;
		required?: boolean | undefined | null;
	}
</script>

<script lang="ts">
	const {
		label = '',
		subLabel,
		id,
		hideLabel = false,
		labelClassName = '',
		required = false
	}: LabelProps = $props();
</script>

<label
	for={id}
	class={`relative block text-sm leading-6 font-medium ${labelClassName} ${hideLabel ? 'sr-only' : ''}`}
>
	<span>
		{label}
		{#if required}
			<span class=" text-error-300 -ml-0.5">*</span>
		{/if}
	</span>
	{#if subLabel}
		<span class="block text-xs font-light">{subLabel}</span>
	{/if}
</label>
