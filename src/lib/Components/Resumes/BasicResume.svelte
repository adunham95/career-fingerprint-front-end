<script lang="ts">
	import type { Education, JobPosition } from '../../../app';
	import Card from '../Containers/Card.svelte';

	interface Props {
		showIncomplete?: boolean;
		personalInfo: {
			firstName: string | null;
			lastName: string | null;
			title: string | null;
			email: string | null;
			phoneNumber: string | null;
			location: string | null;
			website: string | null;
			linkedin: string | null;
			github: string | null;
			summary: string | null;
		};

		experience?: JobPosition[];
		education?: Education[];
	}

	const { personalInfo, experience = [], education = [], showIncomplete = false }: Props = $props();

	console.log(education);

	function formatDate(dateString?: string | null) {
		if (!dateString) {
			return '';
		}
		const date = new Date(dateString);

		const months: string[] = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December'
		];

		return `${months[date.getMonth()]} ${date.getFullYear()}`;
	}
</script>

<Card>
	<div>
		<div class="flex flex-col justify-between md:flex-row">
			<div>
				<p class="text-3xl font-bold">{personalInfo.firstName} {personalInfo.lastName}</p>
				<p class="mt-1 text-xl">{personalInfo.title}</p>
			</div>
			<div class="mt-4 md:mt-0">
				{#if personalInfo.email}
					<div class="mt-2 flex items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="mr-2 h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
							/>
						</svg>
						<span>{personalInfo.email}</span>
					</div>
				{/if}
				{#if personalInfo.phoneNumber}
					<div class="mt-2 flex items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="mr-2 h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
							/>
						</svg>
						<span>{personalInfo.phoneNumber}</span>
					</div>
				{/if}
				{#if personalInfo.location}
					<div class="mt-2 flex items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="mr-2 h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
							/>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
							/>
						</svg>
						<span>{personalInfo.location}</span>
					</div>
				{/if}
			</div>
		</div>
		{#if personalInfo.summary}
			<div class="mt-6">
				<p class="text-lg">{personalInfo.summary}</p>
			</div>
		{/if}
	</div>

	<!-- Content -->
	<div class="pt-8">
		<!-- Experience -->
		<section class="mb-10">
			<h2 class="border-primary mb-6 border-b-2 pb-2 text-2xl font-bold text-gray-800">
				Professional Experience
			</h2>
			{#each experience as job}
				{#if showIncomplete || (job.name && job.company && job.startDate)}
					<div class="mb-8">
						<div class="mb-2 flex flex-col justify-between md:flex-row">
							<h3 class="text-xl font-semibold text-gray-800">
								{job.name} | {job.company}
							</h3>
							<div class="text-gray-600">
								{formatDate(job.startDate)} - {job.currentPosition
									? 'Current'
									: formatDate(job.endDate)}
							</div>
						</div>
						<div class="mb-2 text-gray-600">{job.location}</div>
						<p class="mb-3 whitespace-pre-wrap text-gray-700">{job.description}</p>
						<!-- <ul class="list-inside list-disc pl-4 text-gray-700">
					{#each job.achievements as achievement}
						<li class="mb-1">{achievement}</li>
					{/each}
				</ul> -->
					</div>
				{/if}
			{/each}
		</section>

		<!-- Education -->
		<section class="mb-10">
			<h2 class="border-primary mb-6 border-b-2 pb-2 text-2xl font-bold text-gray-800">
				Education
			</h2>
			{#each education as edu}
				{#if showIncomplete || (edu.degree && edu.institution)}
					<div class="mb-6">
						<div class="mb-2 flex flex-col justify-between md:flex-row">
							<h3 class="text-xl font-semibold text-gray-800">{edu.degree}</h3>
							<div class="text-gray-600">
								{formatDate(edu.startDate)} - {edu.currentPosition
									? 'Current'
									: formatDate(edu.endDate)}
							</div>
						</div>
						<div class="mb-2 text-gray-700">{edu.institution}</div>
						<p class="text-gray-600">{edu.description}</p>
					</div>
				{/if}
			{/each}
		</section>
	</div>

	<!-- Footer -->
	{#snippet actions()}
		<div class="flex justify-center space-x-6">
			<a
				href={`https://${personalInfo.website}`}
				aria-label="Personal Website"
				target="_blank"
				rel="noopener noreferrer"
				class="text-primary hover:text-primary-dark"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
					/>
				</svg>
			</a>
			<a
				href={`https://${personalInfo.linkedin}`}
				aria-label="Linkedin"
				target="_blank"
				rel="noopener noreferrer"
				class="text-primary hover:text-primary-dark"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					fill="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
					/>
				</svg>
			</a>
			<a
				href={`https://${personalInfo.github}`}
				aria-label="Github"
				target="_blank"
				rel="noopener noreferrer"
				class="text-primary hover:text-primary-dark"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					fill="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
					/>
				</svg>
			</a>
		</div>
	{/snippet}
</Card>
