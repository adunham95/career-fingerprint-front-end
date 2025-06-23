<script lang="ts">
	interface Props {
		label: string;
		id: string;
		type?: 'text' | 'number' | 'date';
		value: string;
		placeholder?: string;
		width?: number;
		disabled?: boolean;
	}

	const {
		label,
		id,
		type = 'text',
		value = $bindable(''),
		placeholder,
		width = 200
	}: Props = $props();
</script>

<span class="inline-block min-w-20" style={`width: ${width}px`}>
	<label for={id} class="sr-only">{label}</label>
	<div class="relative rounded-lg">
		<input
			{type}
			name={id}
			{id}
			class="peer block w-full border-0 bg-gray-50 px-3 py-1.5 text-gray-900 placeholder:text-gray-500 focus:outline-none sm:text-sm/6"
			{placeholder}
		/>
		<div
			class="peer-focus:border-primary absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2"
			aria-hidden="true"
		></div>
	</div>
</span>
