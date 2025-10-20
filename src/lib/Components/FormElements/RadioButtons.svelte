<script lang="ts">
	const buttons = [
		{ id: '1', label: 'Button One', value: '1' },
		{ id: '2', label: 'Button Two', value: '2' },
		{ id: '3', label: 'Button Three', value: '3' }
	];
</script>

<span class="isolate inline-flex rounded-md shadow-xs">
	{#each buttons as button, idx}
		<label
			aria-label="4 GB"
			class="relative inline-flex items-center rounded-l-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 inset-ring-1 inset-ring-gray-300 hover:bg-gray-50 focus:z-10"
		>
			<input
				type="radio"
				name="option"
				value={button.value}
				class="absolute inset-0 appearance-none focus:outline-none disabled:cursor-not-allowed"
			/>
			<span class="text-sm font-medium text-gray-900 uppercase group-has-checked:text-white">
				{button.label}
			</span>
		</label>
	{/each}
	<button
		type="button"
		class="relative inline-flex items-center rounded-l-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 inset-ring-1 inset-ring-gray-300 hover:bg-gray-50 focus:z-10"
		>Years</button
	>
	<button
		type="button"
		class="relative -ml-px inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 inset-ring-1 inset-ring-gray-300 hover:bg-gray-50 focus:z-10"
		>Months</button
	>
	<button
		type="button"
		class="relative -ml-px inline-flex items-center rounded-r-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 inset-ring-1 inset-ring-gray-300 hover:bg-gray-50 focus:z-10"
		>Days</button
	>
</span>
