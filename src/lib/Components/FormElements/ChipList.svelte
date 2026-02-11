<script lang="ts">
	interface Props {
		chips: string[];
		onChange?: () => void;
	}

	let { chips = $bindable(), onChange }: Props = $props();

	let newChip = $state('');

	function addChip() {
		const trimmed = newChip.trim();
		if (trimmed && !chips.includes(trimmed)) {
			chips = [...chips, trimmed];
			newChip = '';
		}
		onChange?.();
	}

	function removeChip(index: number) {
		chips = chips.filter((_, i) => i !== index);
		onChange?.();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			addChip();
		}
	}
</script>

<div class="flex flex-wrap items-center gap-2 rounded-lg p-2">
	{#each chips as chip, i}
		<div class="flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-800">
			<span>{chip}</span>
			<button
				type="button"
				class="ml-2 text-gray-500 hover:text-red-500"
				onclick={() => removeChip(i)}
			>
				✕
			</button>
		</div>
	{/each}

	<!-- Input + Add button -->
	<div>
		<input
			bind:value={newChip}
			onkeydown={handleKeydown}
			placeholder="Add..."
			class="rounded border px-2 py-1 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
		/>
		<button type="button" onclick={addChip} class="btn btn-small btn--primary"> Add </button>
	</div>
</div>
