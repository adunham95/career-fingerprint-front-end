<script lang="ts">
	import { goto } from '$app/navigation';
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
	import TextArea from '$lib/Components/FormElements/TextArea.svelte';
	import TextInput from '$lib/Components/FormElements/TextInput.svelte';
	import BasicResume from '$lib/Components/Resumes/BasicResume.svelte';
	import { toastStore } from '$lib/Components/Toasts/toast.js';
	import { useFeatureGate } from '$lib/Utils/featureGate.js';
	import type { Education, JobPosition } from '../../../../app.js';
	import { onMount } from 'svelte';
	import { trackingStore } from '$lib/Stores/tracking.js';
	import { PUBLIC_API_URL } from '$env/static/public';
	import PremiumBadge from '$lib/Components/PremiumBadge.svelte';
	import Label from '$lib/Components/FormElements/Label.svelte';
	import { useCreateBulletPoint, useDeleteBulletPoint } from '$lib/API/bullet-points.js';
	import JobDetails from '$lib/Components/Forms/JobDetails.svelte';
	import EducationDetails from '$lib/Components/Forms/EducationDetails.svelte';
	import ChipList from '$lib/Components/FormElements/ChipList.svelte';
	import { useUpdateSkillList } from '$lib/API/skill-list.js';

	const { data } = $props();

	onMount(() => {
		trackingStore.pageViewEvent('Single Resume');
	});

	console.log(data);

	let resume = useGetResumeByIDQuery(data?.resume?.id || '', data?.resume);
	let resumeName = $state($resume.data.name);

	let personalInfo = $state({
		firstName: data.resume?.firstName || data.user.firstName,
		lastName: data.resume?.lastName || data.user.lastName,
		title: data.resume?.title,
		email: data.resume?.email || data.user.email,
		phoneNumber: data.resume?.phoneNumber,
		location: data.resume?.location,
		website: data.resume?.website,
		linkedin: data.resume?.linkedin,
		github: data.resume?.github,
		summary: data.resume?.summary || data.user.pitch || ''
	});

	let chipList = $state(data.mySkills?.skillList || []);

	let jobs = $state(data.jobs || []);
	let education = $state(data.education || []);

	let updateResumeMutation = useUpdateResumeMutation(data.resume?.id || '');
	let duplicateResumeMutation = useDuplicateResumeQuery(data.resume?.id || '');

	let updateResumeObject = useUpdateResumeObjectMutation();
	let deleteResumeObject = useDeleteResumeObjectMutation();
	let addResumeObject = useAddResumeObjectMutation();
	let addBulletPointMutation = useCreateBulletPoint();
	let deleteBulletPointMutation = useDeleteBulletPoint();
	const saveSkillList = useUpdateSkillList();

	async function updateResumeName() {
		try {
			await $updateResumeMutation.mutateAsync({ id: data.resume?.id, name: resumeName });
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
			await $updateResumeMutation.mutateAsync({ id: data.resume?.id, ...personalInfo });
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
		id: string
	): JobPosition | Education {
		switch (type) {
			case 'job-positions':
				let jobData = jobs.find((j) => j.id === id);
				if (!jobData) throw 'missing job';
				let job = { ...jobData };
				console.log({ job });
				if ('name' in job) {
					job as JobPosition;
					return {
						name: job.name,
						company: job.company,
						location: job.location,
						description: job.description,
						startDate: job.startDate ? new Date(job.startDate).toISOString() : null,
						endDate: job.endDate ? new Date(job.endDate).toISOString() : null,
						currentPosition: job.currentPosition,
						bulletPoints: job.bulletPoints
					} as JobPosition;
				}
				return {} as JobPosition;
			case 'education':
				let item = education.find((j) => j.id === id);
				if (!item) throw 'missing education';
				if ('degree' in item) {
					item as Education;
					return {
						degree: item.degree,
						institution: item.institution,
						description: item.description,
						startDate: item.startDate ? new Date(item.startDate).toISOString() : null,
						endDate: item.endDate ? new Date(item.endDate).toISOString() : null,
						currentPosition: item.currentPosition,
						bulletPoints: item.bulletPoints
					} as Education;
				}
				return {} as Education;
			default:
				return {} as JobPosition;
		}
	}

	async function saveObject(type: keyof typeof resumeObjectTypeMap, id: string) {
		try {
			let item = getObjectData(type, id);
			console.log({ item });
			await $updateResumeObject.mutateAsync({
				type,
				itemID: id,
				item: getObjectData(type, id)
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
			await $duplicateResumeMutation.refetch();
			goto(`/resumes`);
		} catch (error) {
			toastStore.show({
				message: 'Error duplicating resume'
			});
		}
	}

	async function addBulletPoint(newBulletPointData: {
		jobPositionID?: string;
		educationID?: string;
		text?: string;
	}) {
		try {
			let newBulletPoint = await $addBulletPointMutation.mutateAsync({
				...newBulletPointData,
				resumeID: data.resume?.id || ''
			});

			if (newBulletPointData.jobPositionID) {
				let jobPosition = jobs.find((j) => j.id === newBulletPointData.jobPositionID);
				jobPosition?.bulletPoints.push(newBulletPoint);
			}
			if (newBulletPointData.educationID) {
				let eduPosition = education.find((j) => j.id === newBulletPointData.educationID);
				eduPosition?.bulletPoints.push(newBulletPoint);
			}
		} catch (error) {}
	}

	async function deleteBulletPoint(bulletPointID: string) {
		try {
			let deletedBulletPoint = await $deleteBulletPointMutation.mutateAsync({ bulletPointID });
			if (deletedBulletPoint.jobPositionID) {
				const job = jobs.find((j) => j.id === deletedBulletPoint.jobPositionID);
				if (!job) return;
				job.bulletPoints = job.bulletPoints.filter((bp) => bp.id !== bulletPointID);
			}
			if (deletedBulletPoint?.educationID) {
				const edu = education.find((j) => j.id === deletedBulletPoint?.educationID);
				if (!edu) return;
				edu.bulletPoints = edu.bulletPoints.filter((bp) => bp.id !== bulletPointID);
			}
		} catch (error) {
			console.log(error);
		}
	}

	async function saveSkills() {
		try {
			await $saveSkillList.mutateAsync({ skillList: chipList });
			toastStore.show({ message: 'Skill List Saved' });
		} catch (error) {}
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
						onclick={() => {
							duplicateResume();
							trackingStore.trackAction('Duplicate resume');
						}}
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
						<button
							class="btn btn-text--success btn-small"
							onclick={() => {
								updateResume();
								trackingStore.trackAction('Updated Resume', { section: 'Profile' });
							}}>Save</button
						>
					{/snippet}
				</Card>
			</Accordion>
			<Accordion title="Jobs">
				<div class="space-y-4">
					<ul role="list">
						{#each jobs || [] as job, idx}
							<li class="py-1">
								<Card contentClassName="flex" size="sm">
									<div class=" flex flex-1 flex-row">
										<div>
											<div class="flex justify-between text-base font-medium text-gray-900">
												<h3>
													{job.name}
												</h3>
											</div>
											<p class="mt-1 text-sm text-gray-500">{job.company}</p>
										</div>
										<div class="flex flex-1 items-end justify-end text-sm">
											<div class="flex">
												<button type="button" class="btn btn-text--primary btn-small">
													Add To Resume
												</button>
											</div>
										</div>
									</div>
								</Card>
							</li>
						{/each}
					</ul>
					{#each jobs || [] as job, idx}
						<Card contentClassName="space-y-2 px-4 py-4">
							<div>
								<div class="flex justify-between text-base font-medium text-gray-900">
									<h3>
										{job.name}
									</h3>
								</div>
								<p class="my-1 pb-1 text-sm text-gray-500">{job.company}</p>
								<!-- <JobDetails bind:job={jobs[idx]} {idx} /> -->
								<TextArea id="description" label="Summary" />
								<div>
									<Label id="" label="Achievements" />
									<div class=" max-h-24 min-h-6 overflow-y-scroll">
										{#if job.achievements?.length > 0}
											<ul class=" space-y-1">
												{#each job.achievements as achievement, idx}
													<li class="text-sm text-gray-600">
														<button
															class="group/ach relative w-full rounded px-2 py-1 text-start"
															onclick={() => {
																trackingStore.trackAction('Updated Resume', {
																	section: 'Job Position',
																	button: 'Add Bullet Point From Achievement'
																});
																addBulletPoint({
																	jobPositionID: job.id,
																	text: achievement.myContribution
																});
															}}
														>
															<span>
																{achievement.myContribution}
															</span>
															<span
																class="bg-pastel-green-600/90 absolute inset-0 hidden items-center justify-end rounded px-1 group-hover/ach:flex"
															>
																Add Achievement Bullet Point
															</span>
														</button>
													</li>
												{/each}
											</ul>
										{:else}
											<p class="text-sm text-gray-400 italic">No achievements added yet</p>
										{/if}
									</div>
								</div>
								<div>
									<Label id="" label="Bullet Points" />
									<div class=" max-h-24 min-h-6 overflow-y-scroll">
										<ul class=" space-y-1">
											{#each job.bulletPoints as bulletPoint, idx}
												<li class="flex items-center text-sm text-gray-600">
													<TextInput
														className="flex-1"
														id={'bulletPoint' + idx}
														label=""
														bind:value={bulletPoint.text}
													/>
													<button
														class="btn btn-text--error"
														onclick={() => deleteBulletPoint(bulletPoint.id)}
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															fill="none"
															viewBox="0 0 24 24"
															stroke-width="1.5"
															stroke="currentColor"
															class="size-6"
														>
															<path
																stroke-linecap="round"
																stroke-linejoin="round"
																d="M6 18 18 6M6 6l12 12"
															/>
														</svg>
														<span class="sr-only">Delete {bulletPoint.text}</span>
													</button>
												</li>
											{/each}
											<button
												class="btn btn-text--success btn-small w-full text-start"
												onclick={() => {
													addBulletPoint({ jobPositionID: job.id });
													trackingStore.trackAction('Updated Resume', {
														section: 'Job Position',
														button: 'Add Bullet Point'
													});
												}}
											>
												Add Bullet Point
											</button>
										</ul>
									</div>
								</div>
							</div>
							{#snippet actions()}
								<button
									class="btn btn-text--error btn-small"
									onclick={() => {
										deleteObject('job-positions', job.id);
										trackingStore.trackAction('Updated Resume', {
											section: 'Job Position',
											button: 'Delete'
										});
									}}>Delete</button
								>
								<!-- <button class="btn btn-text--success btn-small">Save For This Resume</button> -->
								<button
									class="btn btn-text--success btn-small"
									onclick={() => {
										saveObject('job-positions', job.id);
										trackingStore.trackAction('Updated Resume', {
											section: 'Job Position',
											button: 'Save'
										});
									}}>Save</button
								>
							{/snippet}
						</Card>
					{/each}
				</div>
			</Accordion>
			<Accordion title="Education">
				{#snippet actions()}
					<button
						class="btn btn-outline--accent btn-small"
						onclick={() => {
							addObject('education');
							trackingStore.trackAction('Add Resume Object', { objectType: 'education' });
						}}>Add Education</button
					>
				{/snippet}
				<div class="space-y-2">
					{#each education || [] as edu, idx}
						<Card contentClassName="space-y-2 px-4 py-4">
							<EducationDetails bind:education={education[idx]} {idx} />
							<div>
								<Label id="" label="Achievements" />
								<div class=" max-h-24 min-h-6 overflow-y-scroll">
									{#if edu.achievements?.length > 0}
										<ul class=" space-y-1">
											{#each edu.achievements as achievement, idx}
												<li class="text-sm text-gray-600">
													<button
														class="group/ach relative w-full rounded px-2 py-1 text-start"
														onclick={() => {
															trackingStore.trackAction('Updated Resume', {
																section: 'Education',
																button: 'Add Bullet Point From Achievement'
															});
															addBulletPoint({
																educationID: edu.id,
																text: achievement.myContribution
															});
														}}
													>
														<span>
															{achievement.myContribution}
														</span>
														<span
															class="bg-pastel-green-600/90 absolute inset-0 hidden items-center justify-end rounded px-1 group-hover/ach:flex"
														>
															Add Achievement Bullet Point
														</span>
													</button>
												</li>
											{/each}
										</ul>
									{:else}
										<p class="text-sm text-gray-400 italic">No achievements added yet</p>
									{/if}
								</div>
							</div>
							<div>
								<Label id="" label="Bullet Points" />
								<div class=" max-h-24 min-h-6 overflow-y-scroll">
									<ul class=" space-y-1">
										{#each edu.bulletPoints as bulletPoint, idx}
											<li class="flex items-center text-sm text-gray-600">
												<TextInput
													className="flex-1"
													id={'bulletPoint' + idx}
													label=""
													bind:value={bulletPoint.text}
												/>
												<button
													class="btn btn-text--error"
													onclick={() => deleteBulletPoint(bulletPoint.id)}
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														fill="none"
														viewBox="0 0 24 24"
														stroke-width="1.5"
														stroke="currentColor"
														class="size-6"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															d="M6 18 18 6M6 6l12 12"
														/>
													</svg>
													<span class="sr-only">Delete {bulletPoint.text}</span>
												</button>
											</li>
										{/each}
										<button
											class="btn btn-text--success btn-small w-full text-start"
											onclick={() => {
												addBulletPoint({ educationID: edu.id });
												trackingStore.trackAction('Updated Resume', {
													section: 'Education',
													button: 'Add Bullet Point'
												});
											}}
										>
											Add Bullet Point
										</button>
									</ul>
								</div>
							</div>
							{#snippet actions()}
								<button
									class="btn btn-text--error btn-small"
									onclick={() => deleteObject('education', edu.id)}>Delete</button
								>
								<!-- <button class="btn btn-text--success btn-small">Save For This Resume</button> -->
								<button
									class="btn btn-text--success btn-small"
									onclick={() => saveObject('education', edu.id)}>Save</button
								>
							{/snippet}
						</Card>
					{/each}
				</div>
			</Accordion>
			<Accordion title="Skills">
				<ChipList bind:chips={chipList} onChange={saveSkills} />
			</Accordion>
			{#if useFeatureGate(1, data.user)}
				<p class="mt-4 text-gray-600">Download a PDF version this resume</p>
				<a
					target="_blank"
					href={`${PUBLIC_API_URL}/resume/${data?.resume?.id}/pdf`}
					download
					class="btn btn--primary relative mt-2 flex w-full justify-center"
					onclick={() => trackingStore.trackAction('Download Resume')}
				>
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
					<PremiumBadge />
				</a>
			{:else}
				<FeatureBlock
					title="Download Resume"
					description="To download your resume, upgrade to the pro plan"
				/>
			{/if}
		</div>
		<div class="md:col-span-2">
			<BasicResume
				{personalInfo}
				experience={jobs}
				{education}
				showIncomplete
				skillList={chipList}
			/>
		</div>
	</div>
</PageContainer>
