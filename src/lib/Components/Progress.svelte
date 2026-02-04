<script lang="ts">
	interface Props {
		color?: string;
		value: number;
		max?: number;
	}

	const { value, max = 100, color = '#ffa3ba' }: Props = $props();

	const percentage = $derived.by(() => {
		if (value > max) {
			return 100;
		} else if (value <= 0) {
			return 0;
		}

		let v = value / max;

		console.log({ v, value, max });

		return v * 100;
	});
</script>

<div class="overflow-hidden rounded-full bg-gray-200">
	<div style={`width:${percentage}%;background:${color}`} class="h-2 rounded-full"></div>
</div>
