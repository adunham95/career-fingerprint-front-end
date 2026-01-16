<script lang="ts">
	interface Props {
		id: string;
		options?: { id: string | null; label?: string }[];
		value?: string | null;
	}

	let { id, options, value = $bindable() }: Props = $props();
</script>

<div class="mt-2 flex gap-3">
	{#each options as opt}
		<label
			aria-label={opt.label}
			class="group btn has-checked:bg-primary btn-outline--primary relative flex w-full items-center justify-center has-checked:text-white"
		>
			<input
				type="radio"
				name={id}
				value={opt.id}
				bind:group={value}
				class="absolute inset-0 hidden appearance-none focus:outline-none disabled:cursor-not-allowed"
			/>
			<span class="text-sm font-medium uppercase">
				{opt.label}
			</span>
		</label>
	{/each}
</div>
