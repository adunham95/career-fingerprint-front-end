<script lang="ts">
	import Label from '../FormElements/Label.svelte';
	import TextInput from '../FormElements/TextInput.svelte';

	interface Props {
		formID: string;
	}

	const { formID }: Props = $props();

	let difficultyLevels = [
		{ id: 'easy', name: 'Easy', skillPoints: 3 },
		{ id: 'medium', name: 'Medium', skillPoints: 5 },
		{ id: 'hard', name: 'Hard', skillPoints: 10 }
	];

	let difficultyLevel = $state('');

	let categoryOptions = [
		{
			id: 'public_speaking',
			title: 'Public Speaking',
			category: 'communication',
			description:
				'Build confidence speaking in front of others, presenting ideas, or leading discussions.',
			keywords: ['presentation', 'public speaking', 'speech', 'communication'],
			actions: ['presented', 'explained', 'reported', 'spoke']
		},
		{
			id: 'leadership',
			title: 'Leadership & Ownership',
			category: 'leadership',
			description: 'Grow your ability to lead projects, guide others, and take initiative.',
			keywords: ['leadership', 'team', 'ownership', 'initiative'],
			actions: ['led', 'organized', 'coordinated', 'initiated']
		},
		{
			id: 'problem_solving',
			title: 'Problem Solving',
			category: 'problem_solving',
			description:
				'Strengthen your ability to break down problems, troubleshoot issues, and find solutions.',
			keywords: ['problem solving', 'troubleshoot', 'analysis', 'root cause'],
			actions: ['debugged', 'resolved', 'investigated', 'fixed']
		},
		{
			id: 'organization',
			title: 'Organization & Planning',
			category: 'productivity',
			description: 'Improve how you plan, prioritize, and keep work organized day-to-day.',
			keywords: ['planning', 'organization', 'prioritization', 'documentation'],
			actions: ['planned', 'organized', 'documented', 'prioritized']
		},
		{
			id: 'collaboration',
			title: 'Collaboration & Teamwork',
			category: 'collaboration',
			description: 'Build stronger habits around working with others and supporting your team.',
			keywords: ['collaboration', 'teamwork', 'partnership', 'support'],
			actions: ['collaborated', 'supported', 'reviewed', 'paired']
		},
		{
			id: 'creativity',
			title: 'Creativity & Innovation',
			category: 'creativity',
			description:
				'Develop your ability to generate ideas, think creatively, and explore new approaches.',
			keywords: ['creativity', 'innovation', 'ideas', 'brainstorming'],
			actions: ['designed', 'conceptualized', 'created', 'brainstormed']
		},
		{
			id: 'project_management',
			title: 'Project Management',
			category: 'project_management',
			description:
				'Strengthen how you plan projects, track progress, and keep work moving forward.',
			keywords: ['project', 'timeline', 'milestone', 'requirements'],
			actions: ['planned', 'tracked', 'coordinated', 'delivered']
		},
		{
			id: 'customer_focus',
			title: 'Customer Focus',
			category: 'customer',
			description: 'Improve how you listen to, support, and communicate with customers or clients.',
			keywords: ['customer', 'client', 'feedback', 'support'],
			actions: ['supported', 'guided', 'assisted', 'advised']
		},
		{
			id: 'learning',
			title: 'Learning & Skill Development',
			category: 'growth',
			description:
				'Stay intentional about building new skills and investing in your personal growth.',
			keywords: ['learning', 'skills', 'training', 'improvement'],
			actions: ['studied', 'practiced', 'researched', 'learned']
		},
		{
			id: 'writing',
			title: 'Writing & Documentation',
			category: 'documentation',
			description:
				'Improve clarity in writing, documentation, and sharing information with others.',
			keywords: ['writing', 'documentation', 'clarity', 'instructions'],
			actions: ['wrote', 'documented', 'outlined', 'summarized']
		}
	];

	let selectedCategory = $state<string[]>([]);

	function saveNewGoal() {
		let categories = categoryOptions.filter((c) => selectedCategory.includes(c.category));
		let difficulty = difficultyLevels.find((d) => d.id === difficultyLevel);

		console.log({ categories, difficulty });
	}
</script>

<form
	id={formID}
	onsubmit={(e) => {
		e.preventDefault();
		saveNewGoal();
	}}
>
	<TextInput id="name" label="Goal Name" />

	<div class="pt-2">
		<Label id="" label="Select a difficulty level" />
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
							Skill Points {level.skillPoints}
						</p>
					</div>
				</label>
			{/each}
		</div>
	</div>

	<div class="pt-2">
		<Label label="Select a skill" subLabel="Choose up to 3 skill areas that best match your goal" />

		<div class="grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-3 pt-2">
			{#each categoryOptions as cat}
				<label
					for={cat.category}
					class={`cursor-pointer rounded border-2 bg-white p-2 transition-all
					${
						selectedCategory.includes(cat.category)
							? 'border-accent bg-accent/10 shadow-md'
							: 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
					}
				`}
				>
					<input
						id={cat.category}
						type="checkbox"
						value={cat.category}
						name="categories"
						class="hidden"
						bind:group={selectedCategory}
					/>

					<div class="flex flex-col gap-1">
						<p class="truncate font-medium text-gray-900">
							{cat.title}
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
