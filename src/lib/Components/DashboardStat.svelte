<script lang="ts">
	interface Props {
		number: number;
		name: string;
		ofNumber: number;
	}

	const { number, name, ofNumber }: Props = $props();
</script>

<div
	class="relative flex aspect-square w-full items-center justify-center rounded-lg border-2 border-gray-600/30 bg-gray-600/10 px-4 py-2 text-center md:aspect-video"
>
	<div class="px-4 py-5 sm:p-6">
		<dt class=" text-gray-900">{name}</dt>
		<dd class="mt-1 flex items-baseline justify-between md:block lg:flex">
			<div class="flex items-baseline text-2xl font-semibold text-gray-700">
				{number}
				<span class="ml-2 text-sm font-medium text-gray-500">of {ofNumber}</span>
			</div>
		</dd>
	</div>
</div>
