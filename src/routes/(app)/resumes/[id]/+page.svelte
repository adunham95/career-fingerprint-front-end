<script lang="ts">
	import { goto } from '$app/navigation';
	import { useMyEducationQuery } from '$lib/API/education.js';
	import { useMyJobPositionsQuery } from '$lib/API/job-positions.js';
	import {
		resumeObjectTypeMap,
		useAddResumeObjectMutation,
		useDeleteResumeObjectMutation,
		useDuplicateResumeQuery,
		useGetResumeByIDQuery,
		useUpdateResumeMutation,
		useUpdateResumeObjectMutation
	} from '$lib/API/resume.js';
	import Accordion from '$lib/Components/Accordion.svelte';
	import Card from '$lib/Components/Containers/Card.svelte';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import FeatureBlock from '$lib/Components/FeatureBlock.svelte';
	import AutogrowTextInput from '$lib/Components/FormElements/AutogrowTextInput.svelte';
	import DateInput from '$lib/Components/FormElements/DateInput.svelte';
	import TextArea from '$lib/Components/FormElements/TextArea.svelte';
	import TextInput from '$lib/Components/FormElements/TextInput.svelte';
	import Toggle from '$lib/Components/FormElements/Toggle.svelte';
	import BasicResume from '$lib/Components/Resumes/BasicResume.svelte';
	import { toastStore } from '$lib/Components/Toasts/toast.js';
	import { useFeatureGate } from '$lib/Utils/featureGate.js';
	import { add } from 'date-fns';
	import type { Education, JobPosition } from '../../../../app.js';

	const { data } = $props();

	console.log(data);

	let resume = useGetResumeByIDQuery(data.resume.id, data.resume);
	let resumeName = $state($resume.data.name);

	let personalInfo = $state({
		firstName: data.resume.firstName || data.user.firstName,
		lastName: data.resume.lastName || data.user.lastName,
		title: data.resume.title,
		email: data.resume.contactEmail || data.user.email,
		phoneNumber: data.resume.phoneNumber,
		location: data.resume.location,
		website: data.resume.website,
		linkedin: data.resume.linkedIn,
		github: data.resume.github,
		summary: data.resume.summary || data.user.pitch || ''
	});

	// let jobs = useMyJobPositionsQuery(data.jobs);
	// let education = useMyEducationQuery(data.education);

	let jobs = $state(data.jobs || []);
	let education = $state(data.education || []);

	let updateResumeMutation = useUpdateResumeMutation(data.resume.id);
	let duplicateResumeMutation = useDuplicateResumeQuery(data.resume.id);

	let updateResumeObject = useUpdateResumeObjectMutation();
	let deleteResumeObject = useDeleteResumeObjectMutation();
	let addResumeObject = useAddResumeObjectMutation();

	async function updateResumeName() {
		try {
			await $updateResumeMutation.mutateAsync({ id: data.resume.id, name: resumeName });
			toastStore.show({
				type: 'success',
				message: `Resume Updated`
			});
		} catch (error) {
			toastStore.show({
				type: 'error',
				message: `Failed to update resume`
			});
		}
	}

	async function updateResume() {
		try {
			await $updateResumeMutation.mutateAsync({ id: data.resume.id, ...personalInfo });
			toastStore.show({
				type: 'success',
				message: `Resume Updated`
			});
		} catch (error) {
			toastStore.show({
				type: 'error',
				message: `Failed to update resume`
			});
		}
	}

	async function addObject(type: keyof typeof resumeObjectTypeMap) {
		try {
			let addedObject = await $addResumeObject.mutateAsync({ type });

			console.log(addedObject, 'type', type);

			switch (type) {
				case 'job-positions':
					jobs.push(addedObject as JobPosition);
					break;
				case 'education':
					education.push(addedObject as Education);
					break;

				default:
					break;
			}

			toastStore.show({
				type: 'success',
				message: `${resumeObjectTypeMap[type]} Added`
			});
		} catch (error) {
			toastStore.show({
				type: 'error',
				message: `${resumeObjectTypeMap[type]} Added`
			});
		}
	}

	async function deleteObject(type: keyof typeof resumeObjectTypeMap, id: string) {
		try {
			let deletedObject = await $deleteResumeObject.mutateAsync({ type, itemID: id });

			switch (type) {
				case 'job-positions':
					jobs = jobs?.filter((j) => j.id !== deletedObject?.id);
					break;
				case 'education':
					education = education?.filter((j) => j.id !== deletedObject?.id);
					break;

				default:
					break;
			}
			toastStore.show({
				type: 'success',
				message: `${resumeObjectTypeMap[type]} Deleted`
			});
		} catch (error) {
			toastStore.show({
				type: 'error',
				message: `Failed to delete ${resumeObjectTypeMap[type]}`
			});
		}
	}

	function getObjectData(
		type: keyof typeof resumeObjectTypeMap,
		item: JobPosition | Education
	): JobPosition | Education {
		switch (type) {
			case 'job-positions':
				if ('name' in item) {
					item as JobPosition;
					return {
						name: item.name,
						company: item.company,
						location: item.company,
						description: item.description,
						startDate: item.startDate ? new Date(item.startDate).toISOString() : null,
						endDate: item.endDate ? new Date(item.endDate).toISOString() : null,
						currentPosition: item.currentPosition
					} as JobPosition;
				}
				return {} as JobPosition;
			case 'education':
				if ('degree' in item) {
					item as Education;
					return {
						degree: item.degree,
						institution: item.institution,
						description: item.description,
						startDate: item.startDate ? new Date(item.startDate).toISOString() : null,
						endDate: item.endDate ? new Date(item.endDate).toISOString() : null,
						currentPosition: item.currentPosition
					} as Education;
				}
				return {} as Education;
			default:
				return {} as JobPosition;
		}
	}

	async function saveObject(type: keyof typeof resumeObjectTypeMap, item: JobPosition | Education) {
		try {
			await $updateResumeObject.mutateAsync({
				type,
				itemID: item.id,
				item: getObjectData(type, item)
			});
			toastStore.show({
				type: 'success',
				message: `${resumeObjectTypeMap[type]} saved`
			});
		} catch (error) {
			toastStore.show({
				type: 'error',
				message: `Error updating ${resumeObjectTypeMap[type]}`
			});
		}
	}

	async function duplicateResume() {
		try {
			const newResume = await $duplicateResumeMutation.refetch();
			goto(`/resumes`);
		} catch (error) {
			toastStore.show({
				message: 'Error duplicating resume'
			});
		}
	}
</script>

<PageContainer>
	<div class="flex justify-between pt-6">
		<AutogrowTextInput
			label="Resume Name"
			id="resumeName"
			bind:value={resumeName}
			placeholder="Untitled Resume"
			textSize="text-3xl"
			onblur={updateResumeName}
		/>
		<el-dropdown class="inline-block">
			<button
				class="focus-visible:ring-primary flex items-center rounded-full text-gray-400 hover:text-gray-600 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-100"
			>
				<span class="sr-only">Open options</span>
				<svg
					viewBox="0 0 20 20"
					fill="currentColor"
					data-slot="icon"
					aria-hidden="true"
					class="size-8"
				>
					<path
						d="M10 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM10 8.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM11.5 15.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z"
					/>
				</svg>
			</button>

			<el-menu
				anchor="bottom end"
				popover
				class="w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition transition-discrete [--anchor-gap:--spacing(2)] focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
			>
				<div class="py-1">
					<button
						onclick={duplicateResume}
						type="button"
						class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-200 hover:text-gray-800 focus:bg-gray-100 focus:text-gray-900 focus:outline-hidden"
					>
						Duplicate Resume
					</button>
				</div>
			</el-menu>
		</el-dropdown>
	</div>
	<div class="grid grid-cols-1 gap-x-8 gap-y-8 py-10 md:grid-cols-3">
		<div class="col-span-1">
			<Accordion title="Profile">
				<Card contentClassName="space-y-2 px-4 py-4">
					<TextInput id="firstName" label="First Name" bind:value={personalInfo.firstName} />
					<TextInput id="lastName" label="Last Name" bind:value={personalInfo.lastName} />
					<TextInput
						id="contactEmail"
						label="Contact Email"
						type="email"
						bind:value={personalInfo.email}
					/>
					<TextInput id="phone" label="Phone" type="phone" bind:value={personalInfo.phoneNumber} />
					<TextInput id="location" label="Location" bind:value={personalInfo.location} />
					<TextInput id="website" label="Website" bind:value={personalInfo.website} />
					<TextInput id="linkedin" label="Linkedin" bind:value={personalInfo.linkedin} />
					<TextArea id="summary" label="Summary" bind:value={personalInfo.summary} />
					{#snippet actions()}
						<button class="btn btn-text--success btn-small" onclick={updateResume}>Save</button>
					{/snippet}
				</Card>
			</Accordion>
			<Accordion title="Jobs">
				{#snippet actions()}
					<button
						class="btn btn-outline--accent btn-small"
						onclick={() => addObject('job-positions')}>Add Job</button
					>
				{/snippet}
				<div class="space-y-4">
					<!-- {#each $jobs.data || [] as job, idx} -->
					{#each jobs || [] as job, idx}
						<Card contentClassName="space-y-2 px-4 py-4">
							<TextInput id={'title' + idx} label="Title" bind:value={job.name} />
							<TextInput id={'company' + idx} label="Company" bind:value={job.company} />
							<TextInput id={'location' + idx} label="Location" bind:value={job.location} />
							<Toggle label="Current Job" bind:checked={job.currentPosition} />
							<DateInput id={'startDate' + idx} label="Start Date" bind:value={job.startDate} />
							{#if !job.currentPosition}
								<DateInput id={'endDate' + idx} label="End Date" bind:value={job.endDate} />
							{/if}
							<TextArea
								id={'description' + idx}
								label="Basic Description"
								bind:value={job.description}
							></TextArea>
							{#snippet actions()}
								<button
									class="btn btn-text--error btn-small"
									onclick={() => deleteObject('job-positions', job.id)}>Delete</button
								>
								<!-- <button class="btn btn-text--success btn-small">Save For This Resume</button> -->
								<button
									class="btn btn-text--success btn-small"
									onclick={() => saveObject('job-positions', job)}>Save</button
								>
							{/snippet}
						</Card>
					{/each}
				</div>
			</Accordion>
			<Accordion title="Education">
				{#snippet actions()}
					<button class="btn btn-outline--accent btn-small" onclick={() => addObject('education')}
						>Add Education</button
					>
				{/snippet}
				<div class="space-y-2">
					{#each education || [] as edu, idx}
						<Card contentClassName="space-y-2 px-4 py-4">
							<TextInput id="degree" label="Degree" bind:value={edu.degree} />
							<TextInput id="institution" label="Institution" bind:value={edu.institution} />
							<TextArea id="description" label="Description" bind:value={edu.description}
							></TextArea>
							<Toggle label="Currently In School" bind:checked={edu.currentPosition} />
							<DateInput id={'startDate' + idx} label="Start Date" bind:value={edu.startDate} />
							{#if !edu.currentPosition}
								<DateInput id={'endDate' + idx} label="End Date" bind:value={edu.endDate} />
							{/if}
							{#snippet actions()}
								<button
									class="btn btn-text--error btn-small"
									onclick={() => deleteObject('education', edu.id)}>Delete</button
								>
								<!-- <button class="btn btn-text--success btn-small">Save For This Resume</button> -->
								<button
									class="btn btn-text--success btn-small"
									onclick={() => saveObject('education', edu)}>Save</button
								>
							{/snippet}
						</Card>
					{/each}
				</div>
			</Accordion>
			{#if useFeatureGate(1, data.user)}
				<p class="mt-4 text-gray-600">Download PDF version or print this resume</p>
				<button class="btn btn--primary mt-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="mr-2 inline h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
						/>
					</svg>
					Download Resume
				</button>
			{:else}
				<FeatureBlock
					title="Download Resume"
					description="To download your resume, upgrade to the pro plan"
				/>
			{/if}
		</div>
		<div class="md:col-span-2">
			<BasicResume {personalInfo} experience={jobs} {education} showIncomplete />
		</div>
	</div>
</PageContainer>
