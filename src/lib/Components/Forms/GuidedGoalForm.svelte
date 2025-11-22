<script lang="ts">
	import { goto } from '$app/navigation';
	import ResultTypeSelector from '../ResultTypeSelector.svelte';
	import TagSelector from '../TagSelector.svelte';

	let resultType: string | null = null;
	let tags: string[] = [];
	// let keywords = [];

	let step = 1;

	let title = '';
	let description = '';

	let targetAchievements = 3;

	// resultType card selection
	const resultTypes = [
		{ id: 'quality', label: 'Quality', desc: 'Improve clarity, accuracy, or impact.' },
		{ id: 'efficiency', label: 'Efficiency', desc: 'Work faster, automate, or streamline.' },
		{ id: 'collaboration', label: 'Collaboration', desc: 'Improve teamwork and alignment.' },
		{ id: 'growth', label: 'Growth', desc: 'Increase output, scale results, or expand impact.' }
	];

	// let resultType: string | null = null;

	// tag selection (chips/cards)
	const availableTags = [
		'communication',
		'leadership',
		'collaboration',
		'presentation',
		'analytics',
		'problem-solving',
		'project-management'
	];

	// let tags: string[] = [];

	function toggleTag(tag: string) {
		if (tags.includes(tag)) {
			tags = tags.filter((t) => t !== tag);
		} else {
			tags = [...tags, tag];
		}
	}

	// keyword selection (cards)
	let keywordInput = '';
	let keywords: string[] = [];

	function addKeyword() {
		if (keywordInput.trim().length > 0) {
			keywords = [...keywords, keywordInput.trim()];
			keywordInput = '';
		}
	}

	function removeKeyword(k: string) {
		keywords = keywords.filter((x) => x !== k);
	}

	function next() {
		step = Math.min(step + 1, 5);
	}
	function back() {
		step = Math.max(step - 1, 1);
	}

	// async function submit() {
	// 	const payload = {
	// 		title,
	// 		description,
	// 		tags,
	// 		keywords,
	// 		resultType,
	// 		targetAchievements
	// 	};

	// 	try {
	// 		const created = await mutation.mutateAsync(payload);
	// 		goto(`/goals/${created.id}`);
	// 	} catch (err) {
	// 		console.error(err);
	// 	}
	// }
</script>

<div class="mx-auto max-w-xl space-y-8 py-10">
	<!-- Step Indicators -->
	<div class="flex justify-center space-x-3">
		{#each [1, 2, 3, 4, 5] as s}
			<div
				class="h-3 w-3 rounded-full transition-all
				{s === step ? 'scale-125 bg-blue-600' : 'bg-gray-300'}"
			></div>
		{/each}
	</div>

	<!-- STEP 1: Goal basics -->
	{#if step === 1}
		<h2 class="text-xl font-semibold">What's your goal?</h2>
		<p class="mb-4 text-sm text-gray-600">Describe what you want to improve or accomplish.</p>

		<input
			bind:value={title}
			placeholder="Improve my presentation skills"
			class="w-full rounded border p-3"
		/>

		<textarea
			bind:value={description}
			rows="3"
			placeholder="Become clearer and more confident when presenting."
			class="mt-3 w-full rounded border p-3"
		/>

		<div class="mt-6 flex justify-between">
			<div></div>
			<button on:click={next} class="rounded bg-blue-600 px-5 py-2 text-white">Next →</button>
		</div>
	{/if}

	<!-- STEP 2: Target Achievements -->
	{#if step === 2}
		<h2 class="text-xl font-semibold">How will you measure progress?</h2>
		<p class="mb-4 text-sm text-gray-600">
			You'll complete this goal by logging matching achievements.
		</p>

		<label class="mb-1 block font-medium">Number of achievements required</label>
		<input
			type="number"
			min="1"
			bind:value={targetAchievements}
			class="w-full rounded border p-3"
		/>

		<div class="mt-6 flex justify-between">
			<button on:click={back} class="px-4 py-2 text-gray-600">← Back</button>
			<button on:click={next} class="rounded bg-blue-600 px-5 py-2 text-white">Next →</button>
		</div>
	{/if}

	<!-- STEP 3: Result Type (Cards) -->
	{#if step === 3}
		<h2 class="mb-4 text-xl font-semibold">What type of improvement fits this goal?</h2>

		<ResultTypeSelector value={resultType} onSelect={(v) => (resultType = v)} />

		<div class="mt-6 flex justify-between">
			<button on:click={back} class="px-4 py-2 text-gray-600">← Back</button>
			<button
				on:click={next}
				class="rounded bg-blue-600 px-5 py-2 text-white"
				disabled={!resultType}
			>
				Next →
			</button>
		</div>
	{/if}

	<!-- STEP 4: Tags & Keywords Cards -->
	{#if step === 4}
		<h2 class="mb-4 text-xl font-semibold">Which achievements should count?</h2>

		<p class="mb-3 text-sm text-gray-600">Choose the tags that match your goal.</p>

		<TagSelector
			selected={tags}
			onToggle={(t) => {
				if (tags.includes(t)) {
					tags = tags.filter((x) => x !== t);
				} else {
					tags = [...tags, t];
				}
			}}
		/>

		<!-- Keyword input -->
		<div class="mt-6">
			<p class="mb-2 font-medium">Keywords (optional)</p>

			<div class="flex gap-2">
				<input
					bind:value={keywordInput}
					placeholder="present, speak, explain"
					class="flex-1 rounded border p-2"
				/>
				<button on:click={addKeyword} class="rounded bg-black px-4 text-white">Add</button>
			</div>

			{#if keywords.length > 0}
				<div class="mt-3 flex flex-wrap gap-2">
					{#each keywords as k}
						<div
							class="flex cursor-pointer items-center gap-2 rounded-full bg-gray-200 px-3 py-1 text-gray-800"
							on:click={() => removeKeyword(k)}
						>
							{k}
							<span class="text-red-500">×</span>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<div class="mt-6 flex justify-between">
			<button on:click={back} class="px-4 py-2 text-gray-600">← Back</button>
			<button on:click={next} class="rounded bg-blue-600 px-5 py-2 text-white"> Next → </button>
		</div>
	{/if}

	<!-- STEP 5: Review + Create -->
	{#if step === 5}
		<h2 class="text-xl font-semibold">Review your goal</h2>

		<div class="space-y-2 rounded border bg-gray-50 p-4">
			<p><strong>Goal:</strong> {title}</p>
			{#if description}<p><strong>Description:</strong> {description}</p>{/if}
			<p><strong>Target Achievements:</strong> {targetAchievements}</p>
			<p><strong>Result Type:</strong> {resultType}</p>
			<p><strong>Tags:</strong> {tags.join(', ') || 'None'}</p>
			<p><strong>Keywords:</strong> {keywords.join(', ') || 'None'}</p>
		</div>

		<div class="mt-6 flex justify-between">
			<button on:click={back} class="px-4 py-2 text-gray-600">← Back</button>

			<!-- <button
				on:click={submit}
				class="rounded bg-blue-600 px-5 py-2 text-white disabled:bg-gray-300"
				disabled={mutation.isPending}
			>
				{mutation.isPending ? 'Creating...' : 'Create Goal'}
			</button> -->
		</div>

		<!-- {#if mutation.isError}
			<p class="mt-3 text-sm text-red-600">{mutation.error?.message}</p>
		{/if} -->
	{/if}
</div>
