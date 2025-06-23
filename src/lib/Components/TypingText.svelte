<script lang="ts">
	interface Props {
		text: string;
		onFinish?: () => void;
		textClass?: string;
	}

	const { text, onFinish, textClass }: Props = $props();
	let visibleText = $state('');

	let i = 0;
	let textArray = $derived.by(() => text.split(' '));

	function getRandomInt() {
		return Math.floor(Math.random() * (200 - 50 + 1)) + 100;
	}

	function type() {
		let currentWord = textArray[i];
		visibleText = visibleText + ' ' + currentWord;
		i++;
		if (i < textArray.length) {
			setTimeout(type, getRandomInt());
		} else {
			onFinish && onFinish();
		}
	}
	type();
</script>

<div>
	<p class="sr-only">{text}</p>
	<p class={textClass}>{visibleText}</p>
</div>
