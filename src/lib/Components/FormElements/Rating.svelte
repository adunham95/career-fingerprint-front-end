<script lang="ts">
	import Label, { type LabelProps } from './Label.svelte';

	interface Props extends LabelProps {
		value: string;
		options: { id: string; label: string }[];
		groupName: string;
	}

	let { options, groupName, value = $bindable(), id, label }: Props = $props();

	function getClasses(idx: number) {
		switch (idx) {
			case 0:
				return ' rounded-l-md';
			case options.length - 1:
				return '-ml-px  rounded-r-md';

			default:
				return '-ml-px ring-inset';
		}
	}
</script>

<div>
	<Label {id} {label} />
	<div class="isolate flex w-full rounded-md shadow-xs">
		{#each options as opt, idx}
			<label
				class={`group has-checked:bg-primary  has-checked:hover:bg-primary-600 relative inline-flex w-full cursor-pointer items-center bg-white px-3 py-2 text-center text-sm font-semibold text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-10 ${getClasses(idx)}`}
			>
				<input
					type="radio"
					name={groupName}
					value={opt.id}
					class="peer sr-only"
					onchange={() => (value = opt.id)}
				/>
				<p class="w-full">{opt.label}</p>
			</label>
		{/each}
	</div>
</div>
