<script lang="ts">
	import type { Education, JobPosition } from '../../../app';
	import Card from '../Containers/Card.svelte';

	interface Props {
		showIncomplete?: boolean;
		personalInfo?: {
			firstName: string | null;
			lastName: string | null;
			title?: string | null;
			email: string | null;
			phoneNumber?: string | null;
			location?: string | null;
			website?: string | null;
			linkedin?: string | null;
			github?: string | null;
			summary?: string | null;
		};

		experience?: JobPosition[];
		education?: Education[];
		skillList?: string[];
	}

	const {
		personalInfo,
		experience = [],
		education = [],
		showIncomplete = false,
		skillList = []
	}: Props = $props();

	console.log('education', education);

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
				<p class="text-3xl font-bold">{personalInfo?.firstName} {personalInfo?.lastName}</p>
				<p class="mt-1 text-xl">{personalInfo?.title}</p>
			</div>
			<div class="mt-4 md:mt-0">
				{#if personalInfo?.email}
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
						<span>{personalInfo?.email}</span>
					</div>
				{/if}
				{#if personalInfo?.phoneNumber}
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
						<span>{personalInfo?.phoneNumber}</span>
					</div>
				{/if}
				{#if personalInfo?.location}
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
						<span>{personalInfo?.location}</span>
					</div>
				{/if}
			</div>
		</div>
		{#if personalInfo?.summary}
			<div class="mt-6">
				<p class="text-lg">{personalInfo?.summary}</p>
			</div>
		{/if}
	</div>

	<!-- Content -->
	<div class="pt-8">
		<!-- Skill List -->
		<section class="mb-10">
			<h2 class="border-primary mb-6 border-b-2 pb-1 text-xl font-bold text-gray-800">Skills</h2>
			<div class="flex justify-start gap-1">
				{#each skillList as skill}
					<p>{skill}</p>
				{/each}
			</div>
		</section>
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
						<ul class="list-inside list-disc pl-4 text-gray-700">
							{#each job.bulletPoints as bulletPoint}
								{#if showIncomplete}
									<li class="mb-1">{bulletPoint.text}</li>
								{:else if bulletPoint.text !== ''}
									<li class="mb-1">{bulletPoint.text}</li>
								{/if}
							{/each}
						</ul>
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
						<ul class="list-inside list-disc pl-4 text-gray-700">
							{#each edu.bulletPoints as bulletPoint}
								{#if showIncomplete}
									<li class="mb-1">{bulletPoint.text}</li>
								{:else if bulletPoint.text !== ''}
									<li class="mb-1">{bulletPoint.text}</li>
								{/if}
							{/each}
						</ul>
					</div>
				{/if}
			{/each}
		</section>
	</div>
</Card>
