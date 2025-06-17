<script lang="ts">
	import Label, { type LabelProps } from './Label.svelte';

	interface Props extends LabelProps {
		value: string | null | undefined;
		groupName: string;
		options?: string[];
	}

	let {
		label,
		id,
		groupName,
		hideLabel = false,
		options = [],
		value = $bindable()
	}: Props = $props();

	console.log({ options });
</script>

<Label {id} {label} {hideLabel} />
<div class="flex justify-start max-w-[450px] overflow-x-auto">
	{#each options as option}
		<label
			aria-label={option}
			style={`color: ${option}`}
			class="relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none mr-1 mb-1"
		>
			<input
				onchange={() => (value = option)}
				type="radio"
				name={groupName}
				value={option}
				class="sr-only peer"
			/>
			<span
				aria-hidden="true"
				class="h-8 w-8 rounded-full border-2 border-gray-300 bg-current peer-[:checked]:border-gray-900"
			></span>
		</label>
	{/each}
</div>
