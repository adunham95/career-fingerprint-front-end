<script lang="ts">
	import Label, { type LabelProps } from './Label.svelte';

	interface Props extends LabelProps {
		className?: string;
		rating: number;
		maxRating?: number;
		size?: string;
		readonly?: boolean;
		hideValue?: boolean;
		onRatingChange?: (value: number) => void;
	}

	let {
		id,
		label,
		className,
		rating = $bindable(0),
		maxRating = 5,
		size = 'w-8 h-8',
		readonly = false,
		hideValue = false,
		onRatingChange
	}: Props = $props();

	let hoveredRating = $state(0);

	function handleStarClick(starValue: number) {
		if (readonly) return;

		rating = starValue;
		if (onRatingChange) {
			onRatingChange(starValue);
		}
	}

	function handleStarHover(starValue: number) {
		if (readonly) return;
		hoveredRating = starValue;
	}

	function handleMouseLeave() {
		if (readonly) return;
		hoveredRating = 0;
	}

	function getStarClass(starIndex: number) {
		const currentRating = hoveredRating || rating;
		const isActive = starIndex <= currentRating;

		let baseClass = `${size} transition-colors duration-200 cursor-pointer`;

		if (readonly) {
			baseClass += ' cursor-default';
		}

		if (isActive) {
			return `${baseClass} text-yellow-400 fill-current`;
		} else {
			return `${baseClass} text-gray-300 hover:text-yellow-300 fill-current`;
		}
	}
</script>

<div class={className}>
	<Label {id} {label} />
	<div class="flex items-center gap-1">
		<!-- svelte-ignore a11y_interactive_supports_focus -->
		<div class="flex gap-1" role="radiogroup" aria-label="Rating" onmouseleave={handleMouseLeave}>
			{#each Array(maxRating) as _, i}
				{@const starValue = i + 1}
				<button
					type="button"
					class={getStarClass(starValue)}
					onclick={() => handleStarClick(starValue)}
					onmouseenter={() => handleStarHover(starValue)}
					aria-label="Rate {starValue} star{starValue > 1 ? 's' : ''}"
					disabled={readonly}
				>
					<svg viewBox="0 0 24 24" class="h-full w-full">
						<path
							d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
						/>
					</svg>
				</button>
			{/each}
		</div>

		{#if !hideValue}
			<span class="ml-2 text-sm font-medium text-gray-600">
				{rating}/{maxRating}
			</span>
		{/if}
	</div>
</div>
