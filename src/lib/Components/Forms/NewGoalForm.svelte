<script lang="ts">
	import { useCreateGoal, useGetGoalSkills } from '$lib/API/goals';
	import Label from '../FormElements/Label.svelte';
	import TextInput from '../FormElements/TextInput.svelte';

	interface Props {
		formID: string;
		onSuccess?: () => void;
	}

	const { formID, onSuccess }: Props = $props();

	let difficultyLevels = [
		{
			id: 'path',
			name: 'Path',
			skillPoints: 5,
			description: 'Straightforward tasks requiring minimal effort or preparation.'
		},
		{
			id: 'hill',
			name: 'Hill',
			skillPoints: 9,
			description: 'Tasks that require steady effort and consistent focus.'
		},
		{
			id: 'climb',
			name: 'Climb',
			skillPoints: 15,
			description: 'Challenging tasks that demand strong concentration and time.'
		},
		{
			id: 'summit',
			name: 'Summit',
			skillPoints: 35,
			description: 'Major, complex tasks requiring significant effort and commitment.'
		}
	];

	let difficultyLevel = $state('');
	let selectedCategory = $state<string[]>([]);
	let name = $state('');
	let errors = $state({});

	let categoryOptions = useGetGoalSkills();

	let createNewGoalMutation = useCreateGoal();

	async function saveNewGoal() {
		let errors = {};
		let categories = ($categoryOptions.data || []).filter((c) => selectedCategory.includes(c.id));
		let difficulty = difficultyLevels.find((d) => d.id === difficultyLevel);

		if (!difficulty) {
			return;
		}

		let actions = categories.map((c) => c.actions).flat();
		let keywords = categories.map((c) => c.keywords).flat();

		console.log({ categories, difficulty, actions, keywords });

		try {
			$createNewGoalMutation.mutateAsync({
				name,
				actions,
				keywords,
				targetCount: difficulty?.skillPoints
			});
			onSuccess?.();
		} catch (error) {}
	}

	function handleCategoryClick(event: MouseEvent, category: string) {
		const isSelected = selectedCategory.includes(category);

		// enforce max 3 selected
		if (!isSelected && selectedCategory.length >= 3) {
			event.preventDefault();
			event.stopPropagation();
		}
	}
</script>

<form
	id={formID}
	onsubmit={(e) => {
		e.preventDefault();
		saveNewGoal();
	}}
>
	<TextInput id="name" label="Goal Name" bind:value={name} />

	<div class="pt-2">
		<Label id="" label="Select a effort level" />
		<div class="grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-3 pt-2">
			{#each difficultyLevels as level}
				<label
					for={level.id}
					class={`cursor-pointer rounded border-2 bg-white p-2 transition-all
					${
						difficultyLevel.includes(level.id)
							? 'border-accent bg-accent/10 shadow-md'
							: 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
					}
				`}
				>
					<input
						id={level.id}
						type="radio"
						value={level.id}
						name="categories"
						class="hidden"
						bind:group={difficultyLevel}
					/>

					<div class="flex flex-col gap-1">
						<p class="truncate font-medium text-gray-900">
							{level.name}
						</p>
						<p class="line-clamp-2 text-xs leading-tight text-gray-500">
							{level.description}
						</p>
					</div>
				</label>
			{/each}
		</div>
	</div>

	<div class="pt-2">
		<Label label="Select skills" subLabel="Choose up to 3 skill areas that best match your goal" />

		<div class="grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-3 pt-2">
			{#each $categoryOptions.data as cat}
				<label
					for={cat.id}
					class={`cursor-pointer rounded border-2 bg-white p-2 transition-all
					${
						selectedCategory.includes(cat.id)
							? 'border-accent bg-accent/10 shadow-md'
							: 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
					}
				`}
				>
					<input
						id={cat.id}
						type="checkbox"
						value={cat.id}
						name="categories"
						class="hidden"
						bind:group={selectedCategory}
						onclick={(e) => handleCategoryClick(e, cat.id)}
					/>

					<div class="flex flex-col gap-1">
						<p class="truncate text-sm font-medium text-gray-900">
							{cat.name}
						</p>
						<p class="line-clamp-2 text-xs leading-tight text-gray-500">
							{cat.description}
						</p>
					</div>
				</label>
			{/each}
		</div>
	</div>
</form>
