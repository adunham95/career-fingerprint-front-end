<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Chart, type ChartConfiguration } from 'chart.js/auto';

	interface Props {
		config: ChartConfiguration;
	}

	let { config = $bindable() }: Props = $props();

	let canvas: HTMLCanvasElement;
	let chart: Chart | null = null;

	onMount(() => {
		chart = new Chart(canvas, config);
	});

	// Cleanup
	onDestroy(() => {
		chart?.destroy();
	});

	// Runes: automatically re-run when `config` changes
	// $effect(() => {
	// 	if (chart) {
	// 		chart.update(config);
	// 	}
	// });
</script>

<div class="chart-container">
	<canvas bind:this={canvas}></canvas>
</div>

<style>
	.chart-container {
		width: 100%;
		/* height: 100%; */
		position: relative;
	}

	canvas {
		width: 100% !important;
		/* height: 100% !important; */
	}
</style>
