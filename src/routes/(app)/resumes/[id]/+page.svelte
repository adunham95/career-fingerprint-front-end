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
	import { onMount } from 'svelte';
	import { trackingStore } from '$lib/Stores/tracking.js';
	import { PUBLIC_API_URL } from '$env/static/public';
	import PremiumBadge from '$lib/Components/PremiumBadge.svelte';
	import Label from '$lib/Components/FormElements/Label.svelte';
	import { useCreateBulletPoint, useDeleteBulletPoint } from '$lib/API/bullet-points.js';
	import EducationDetails from '$lib/Components/Forms/EducationDetails.svelte';
	import ChipList from '$lib/Components/FormElements/ChipList.svelte';
	import { useUpdateSkillList } from '$lib/API/skill-list.js';
	import type { ResumeObject } from '../../../../app.js';

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

	let resumeObjects = $state<ResumeObject[]>(data.resumeObjects || []);
	let education = $state(data.education || []);

	let updateResumeMutation = useUpdateResumeMutation(data.resume?.id || '');
	let duplicateResumeMutation = useDuplicateResumeQuery(data.resume?.id || '');

	let addResumeObject = useAddResumeObjectMutation();
	let deleteResumeObjectMutation = useDeleteResumeObjectMutation();
	let updateResumeObjectMutation = useUpdateResumeObjectMutation();

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

	async function addBulletPoint(newBulletPointData: { resumeObjectID: string; text?: string }) {
		try {
			let newBulletPoint = await $addBulletPointMutation.mutateAsync({
				...newBulletPointData
			});

			const index = resumeObjects.findIndex((r) => r.id === newBulletPointData.resumeObjectID);

			if (index !== -1) {
				resumeObjects = resumeObjects.map((r, i) =>
					i === index ? { ...r, bulletPoints: [...(r.bulletPoints || []), newBulletPoint] } : r
				);
			}
		} catch (error) {}
	}

	async function deleteBulletPoint(bulletPointID: string) {
		try {
			let deletedBulletPoint = await $deleteBulletPointMutation.mutateAsync({ bulletPointID });

			const obj = resumeObjects.find((j) => j.id === deletedBulletPoint?.resumeObjectID);
			if (!obj) return;
			obj.bulletPoints = obj.bulletPoints.filter((bp) => bp.id !== bulletPointID);
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

	async function addResumeObjectToResume(jobPositionID?: string, educationID?: string) {
		try {
			let newObject = await $addResumeObject.mutateAsync({
				resumeID: data.resume?.id || '',
				body: { jobPositionID, educationID }
			});
			console.log(newObject);
			if (newObject !== null) {
				resumeObjects.push(newObject);
			}
			toastStore.show({ message: 'Added to Resume' });
		} catch (error) {
			toastStore.show({ message: 'Error Adding to Resume', type: 'error' });
		}
	}

	async function deleteResumeObject(id: string) {
		try {
			let object = await $deleteResumeObjectMutation.mutateAsync({ resumeObjectID: id });
			if (object) {
				resumeObjects = resumeObjects.filter((r) => r.id !== object.id);
				toastStore.show({ message: 'Item Deleted' });
			}
		} catch (error) {
			toastStore.show({ message: 'Could not delete item', type: 'error' });
		}
	}

	async function updateResumeObject(id: string) {
		try {
			let currentObject = resumeObjects.find((o) => o.id === id);
			let object = await $updateResumeObjectMutation.mutateAsync({
				resumeID: data.resume?.id || '',
				resumeObjectID: id,
				item: {
					description: currentObject?.description || '',
					bulletPointOptions: currentObject?.bulletPoints || []
				}
			});
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
						{#each data.jobs || [] as job, idx}
							{#if !resumeObjects.some((j) => j?.job?.id === job.id)}
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
													<button
														type="button"
														class="btn btn-text--primary btn-small"
														onclick={() => {
															addResumeObjectToResume(job.id);
														}}
													>
														Add To Resume
													</button>
												</div>
											</div>
										</div>
									</Card>
								</li>
							{/if}
						{/each}
					</ul>
					{#each resumeObjects.filter((o) => o.type === 'job') || [] as jobObj, idx}
						<Card contentClassName="space-y-2 px-4 py-4">
							<div>
								<div class="flex justify-between text-base font-medium text-gray-900">
									<h3>
										{jobObj?.job?.name || 'Unnamed Job'}
									</h3>
								</div>
								<p class="my-1 pb-1 text-sm text-gray-500">
									{jobObj?.job?.company || 'Unnamed Company'}
								</p>
								<TextArea
									id="description"
									label="Summary"
									bind:value={jobObj.description}
									oninput={() => {}}
								/>
								<div>
									<Label id="" label="Achievements" />
									<div class=" max-h-24 min-h-6 overflow-y-scroll">
										{#if (jobObj?.job?.achievements || []).length > 0}
											<ul class=" space-y-1">
												{#each jobObj?.job?.achievements as achievement, idx}
													<li class="text-sm text-gray-600">
														<button
															class="group/ach relative w-full rounded px-2 py-1 text-start"
															onclick={() => {
																trackingStore.trackAction('Updated Resume', {
																	section: 'Job Position',
																	button: 'Add Bullet Point From Achievement'
																});
																addBulletPoint({
																	resumeObjectID: jobObj.id,
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
											{#each jobObj.bulletPoints as bulletPoint, idx}
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
													addBulletPoint({ resumeObjectID: jobObj.id });
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
										deleteResumeObject(jobObj.id);
										trackingStore.trackAction('Updated Resume', {
											section: 'Job Position',
											button: 'Delete'
										});
									}}>Delete</button
								>
								<button
									class="btn btn-text--success btn-small"
									onclick={() => {
										updateResumeObject(jobObj.id);
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
				<div class="space-y-2">
					<ul role="list">
						{#each data.education || [] as edu, idx}
							{#if !resumeObjects.some((j) => j?.edu?.id === edu.id)}
								<li class="py-1">
									<Card contentClassName="flex" size="sm">
										<div class=" flex flex-1 flex-row">
											<div>
												<div class="flex justify-between text-base font-medium text-gray-900">
													<h3>
														{edu.degree}
													</h3>
												</div>
												<p class="mt-1 text-sm text-gray-500">{edu.institution}</p>
											</div>
											<div class="flex flex-1 items-end justify-end text-sm">
												<div class="flex">
													<button
														type="button"
														class="btn btn-text--primary btn-small"
														onclick={() => {
															addResumeObjectToResume(undefined, edu.id);
														}}
													>
														Add To Resume
													</button>
												</div>
											</div>
										</div>
									</Card>
								</li>
							{/if}
						{/each}
					</ul>
					{#each resumeObjects.filter((o) => o.type === 'education') || [] as eduObj, idx}
						<Card contentClassName="space-y-2 px-4 py-4">
							<div>
								<div class="flex justify-between text-base font-medium text-gray-900">
									<h3>
										{eduObj.edu?.degree || 'Unnamed Degree'}
									</h3>
								</div>
								<p class="my-1 pb-1 text-sm text-gray-500">
									{eduObj.edu?.institution || 'Unnamed Institution'}
								</p>
								<TextArea
									id="description"
									label="Summary"
									bind:value={eduObj.description}
									oninput={() => {}}
								/>
								<Label id="" label="Achievements" />
								<div class=" max-h-24 min-h-6 overflow-y-scroll">
									{#if (eduObj?.edu?.achievements || []).length > 0}
										<ul class=" space-y-1">
											{#each eduObj?.edu?.achievements as achievement, idx}
												<li class="text-sm text-gray-600">
													<button
														class="group/ach relative w-full rounded px-2 py-1 text-start"
														onclick={() => {
															trackingStore.trackAction('Updated Resume', {
																section: 'Education',
																button: 'Add Bullet Point From Achievement'
															});
															addBulletPoint({
																resumeObjectID: eduObj.id,
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
									<ul class="space-y-1">
										{#each eduObj.bulletPoints as bulletPoint, idx}
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
												addBulletPoint({ resumeObjectID: eduObj.id });
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
									onclick={() => {
										deleteResumeObject(eduObj.id);
										trackingStore.trackAction('Updated Resume', {
											section: 'Eduction',
											button: 'Delete'
										});
									}}>Delete</button
								>
								<button
									class="btn btn-text--success btn-small"
									onclick={() => {
										updateResumeObject(eduObj.id);
										trackingStore.trackAction('Updated Resume', {
											section: 'Education',
											button: 'Save'
										});
									}}>Save</button
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
				experience={resumeObjects
					.filter((r) => r.type === 'job')
					.map((j) => {
						return {
							...j?.job,
							bulletPoints: j.bulletPoints,
							description: j.description
						};
					})}
				education={resumeObjects
					.filter((r) => r.type === 'education')
					.map((r) => {
						return {
							...r.edu,
							bulletPoints: r.bulletPoints,
							description: r.description
						};
					})}
				showIncomplete
				skillList={chipList}
			/>
		</div>
	</div>
</PageContainer>
