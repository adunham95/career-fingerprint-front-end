<script lang="ts">
	interface Props {
		id: string;
		label: string;
		subLabel?: string;
		name?: string;
		checked?: boolean;
		wrapperClass?: string;
		onChange?: (id: string, checked: boolean) => void;
	}

	const { id, label, subLabel, name, checked, wrapperClass, onChange }: Props = $props();
</script>

<div class={`flex gap-3 ${wrapperClass}`}>
	<div class="flex h-7 shrink-0 items-center">
		<div class="group grid size-6 grid-cols-1">
			<input
				{id}
				type="checkbox"
				{name}
				{checked}
				onchange={(e) => {
					onChange?.(id, e.currentTarget.checked);
				}}
				class="checked:border-primary-600 checked:bg-primary-600 focus-visible:outline-primary-600 col-start-1 row-start-1 h-full w-auto appearance-none rounded-sm border border-gray-300 bg-white focus-visible:outline-2 focus-visible:outline-offset-2 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
			/>
			<svg
				viewBox="0 0 14 14"
				fill="none"
				class="pointer-events-none col-start-1 row-start-1 size-5.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
			>
				<path
					d="M3 8L6 11L11 3.5"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="opacity-0 group-has-checked:opacity-100"
				/>
				<path
					d="M3 7H11"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="opacity-0 group-has-indeterminate:opacity-100"
				/>
			</svg>
		</div>
	</div>
	<div class="text-base">
		<label for={id} class="font-medium text-gray-900">{label}</label>
		{#if subLabel}
			<p id="comments-description" class="text-gray-500">
				{subLabel}
			</p>
		{/if}
	</div>
</div>
