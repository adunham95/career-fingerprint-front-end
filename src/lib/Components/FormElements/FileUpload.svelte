<script lang="ts">
	import Loader from '../Loader.svelte';
	import Label, { type LabelProps } from './Label.svelte';
	interface Props extends LabelProps {
		className?: string;
		value?: string | null;
		setFile: (e: File) => void;
	}

	let {
		id,
		label,
		hideLabel,
		className = '',
		labelClassName,
		value = $bindable(),
		setFile
	}: Props = $props();

	let isLoading = $state(false);
	let previewRows = $state<string[][]>([]);
	let fileName = $state<string | null>(null);

	function handleFileSelect(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		previewRows = [];
		isLoading = true;
		const file = e.currentTarget?.files?.[0];
		if (!file) {
			isLoading = false;
			return;
		}

		// Dispatch file to parent
		setFile(file);

		// Generate a local preview
		const reader = new FileReader();
		reader.onload = () => {
			const text = reader.result as string;
			const rows = text
				.split('\n')
				.map((r) => r.split(','))
				.slice(0, 5); // show first 5 rows
			previewRows = rows;
			isLoading = false;
		};
		reader.readAsText(file);
	}
</script>

<div class={className}>
	<label
		for={id}
		class="relative mt-2 flex cursor-pointer justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10"
	>
		<input class="sr-only" {id} type="file" accept=".csv" onchange={handleFileSelect} />
		{#if isLoading}
			<div class="absolute inset-0 flex items-center justify-center">
				<Loader size="sm" />
			</div>
		{/if}

		<div>
			{#if fileName}
				<div class="text-sm font-medium text-gray-800">{fileName}</div>
			{:else}
				<div class="flex items-center justify-center">
					<svg
						class="mx-auto size-12 text-gray-300"
						viewBox="0 0 24 24"
						fill="currentColor"
						aria-hidden="true"
					>
						<path
							fill-rule="evenodd"
							d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
							clip-rule="evenodd"
						/>
					</svg>
				</div>
				<div class="mt-4 flex text-sm/6 text-gray-600">
					<p class="text-xs text-gray-600">Click to upload a CSV file(max 10MB)</p>
				</div>
			{/if}
		</div>
	</label>

	{#if previewRows.length > 0}
		<div
			class="mt-4 overflow-x-auto rounded border border-gray-200 bg-gray-50 text-sm text-gray-700"
		>
			<table class="min-w-full border-collapse text-left">
				<tbody>
					{#each previewRows as row, i}
						<tr class={i === 0 ? 'bg-gray-100 font-semibold' : ''}>
							{#each row as cell}
								<td class="border border-gray-200 px-2 py-1">{cell}</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
			<p class="mt-1 text-xs text-gray-500">Showing first {previewRows.length} rows</p>
		</div>
	{/if}
</div>
