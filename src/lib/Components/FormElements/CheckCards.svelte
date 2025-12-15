<script lang="ts">
	import type { Snippet } from 'svelte';

	interface SnippetWithArgs {
		snippet: Snippet;
		args: any[];
	}

	interface Props {
		options: {
			id: string;
			label: string;
			subLabel?: string;
			snippet?: Snippet<[]>;
			name?: string;
		}[];
		checked: string[];
		unChecked?: string[];
		wrapperClass?: string;
	}

	let {
		checked = $bindable(),
		unChecked = $bindable(),
		options,
		wrapperClass = ''
	}: Props = $props();

	function toggleOption(id: string) {
		if (checked.includes(id)) {
			unChecked?.push(id);
			checked = checked.filter((v) => v != id);
		} else {
			unChecked = unChecked?.filter((v) => v != id);
			checked.push(id);
		}
	}
</script>

<div class={`mt-1 grid grid-cols-1 gap-4 sm:grid-cols-2 ${wrapperClass}`}>
	{#each options as option}
		<label
			class="group has-checked:ring-primary-500 relative block cursor-pointer rounded-lg border border-gray-300 p-4 focus:outline-hidden has-checked:ring-2"
		>
			<input
				type="checkbox"
				name={option?.name || option.id}
				value={option.id}
				checked={checked.includes(option.id)}
				class="sr-only"
				onchange={() => toggleOption(option.id)}
			/>
			<div>
				<p class="text-base font-medium text-gray-900">{option.label}</p>
				{#if option.subLabel}
					<p class="mt-1 text-sm text-gray-500">{option.subLabel}</p>
				{/if}
				{#if option.snippet}
					{@render option.snippet()}
				{/if}
			</div>

			<div
				class="group-[has-checked]:border-primary-500 pointer-events-none absolute -inset-px rounded-lg border border-transparent group-[has-checked]:border-2"
				aria-hidden="true"
			></div>
		</label>
	{/each}
</div>
