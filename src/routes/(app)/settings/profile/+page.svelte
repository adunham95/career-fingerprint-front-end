<script lang="ts">
	import { PUBLIC_API_URL } from '$env/static/public';
	import { authClient } from '$lib/auth-client';
	import { useDeleteUserMutation, useStartEmailVerification } from '$lib/API/user.js';
	import Card from '$lib/Components/Containers/Card.svelte';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import TwoColumn from '$lib/Components/Containers/TwoColumn.svelte';
	import ErrorText from '$lib/Components/FormElements/ErrorText.svelte';
	import ImageUpload from '$lib/Components/FormElements/ImageUpload.svelte';
	import Select from '$lib/Components/FormElements/Select.svelte';
	import TextArea from '$lib/Components/FormElements/TextArea.svelte';
	import TextInput from '$lib/Components/FormElements/TextInput.svelte';
	import { toastStore } from '$lib/Components/Toasts/toast.js';
	import { trackingStore } from '$lib/Stores/tracking.js';
	import { onMount } from 'svelte';
	import PasswordRequirements from '$lib/Components/FormElements/PasswordRequirements.svelte';

	const { data } = $props();

	let currentPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');
	let errorMessages = $state<{ [key: string]: string }>({});

	const deleteUserMutation = useDeleteUserMutation();
	const verifyEmailMutation = useStartEmailVerification();

	onMount(() => {
		trackingStore.pageViewEvent('Profile Settings');
	});

	function getUserData(saveType: 'profile' | 'account') {
		switch (saveType) {
			case 'account':
				return {
					firstName: data.user.firstName,
					lastName: data.user.lastName,
					profileImage: data.user.profileImage,
					email: data.user.email
				};
			case 'profile':
				return {
					pitch: data.user.pitch,
					lookingFor: data.user.lookingFor
					// timezone: data.user.timezone
				};

			default:
				return {};
		}
	}

	async function updateAccount(saveType: 'profile' | 'account') {
		const url = `${PUBLIC_API_URL}/users/${data.user.id}`;
		errorMessages = {};

		const res = await fetch(url, {
			method: 'PATCH',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(getUserData(saveType))
		});

		if (res.ok) {
			toastStore.show({ type: 'success', message: `User saved` });
		} else {
			toastStore.show({ type: 'error', message: 'Could not save your changes. Try again.' });
		}
	}

	async function changePassword(e: SubmitEvent) {
		e.preventDefault();
		errorMessages = {};

		if (newPassword !== confirmPassword) {
			errorMessages = { password: 'Passwords do not match' };
			return;
		}

		if (newPassword.length < 6) {
			errorMessages = { password: 'Password must be at least 6 characters' };
			return;
		}

		const { error } = await authClient.changePassword({
			currentPassword,
			newPassword,
			revokeOtherSessions: false
		});

		if (error) {
			errorMessages = { password: error.message ?? 'Could not update password' };
		} else {
			toastStore.show({ type: 'success', message: 'Password updated' });
			currentPassword = '';
			newPassword = '';
			confirmPassword = '';
		}
	}

	async function deleteUserFunc() {
		try {
			await $deleteUserMutation.mutateAsync();
			toastStore.show({ message: 'Your account has been marked for deletion', type: 'success' });
		} catch (error) {
			toastStore.show({ message: 'Could not delete your account. Try again.', type: 'error' });
		}
	}

	async function verifyEmailClick() {
		try {
			await $verifyEmailMutation.mutateAsync();
			toastStore.show({ message: 'Verification Email Sent' });
		} catch (error) {
			toastStore.show({ message: 'Could not send the verification email. Try again in a few minutes.', type: 'error' });
		}
	}
</script>

<PageContainer className="divide-y divide-gray-300">
	<TwoColumn title={'Account'}>
		<Card className="md:col-span-2">
			<form>
				<div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
					<ImageUpload
						className="sm:col-span-6"
						label="Profile Image"
						bind:value={data.user.profileImage}
					/>
					<TextInput
						className="sm:col-span-3"
						id="firstName"
						label="First Name"
						placeholder="Adrian"
						bind:value={data.user.firstName}
					/>
					<TextInput
						className="sm:col-span-3"
						id="lastName"
						label="Last Name"
						placeholder="Dunham"
						bind:value={data.user.lastName}
					/>

					<TextInput
						className="sm:col-span-4"
						id="email"
						label="Email"
						placeholder="adunham95@gmail.com"
						bind:value={data.user.email}
					/>
					<div class="sm:col-span-2">
						{#if data.user.emailVerified}
							<p class="badge badge--success">Verified</p>
						{:else}
							<button type="button" class="btn btn-text--primary" onclick={verifyEmailClick}
								>Verify Email</button
							>
						{/if}
					</div>
				</div>
			</form>
			{#snippet actions()}
				<button
					type="submit"
					class="btn btn--primary"
					onclick={() => {
						updateAccount('account');
						trackingStore.trackAction('Update Account Click', { type: 'account' });
					}}>Update</button
				>
			{/snippet}
		</Card>
	</TwoColumn>
	<TwoColumn title={'Password'}>
		<Card className="md:col-span-2">
			<form
				id="changePassword"
				onsubmit={(e) => {
					changePassword(e);
					trackingStore.trackAction('Update Account Click', { type: 'password' });
				}}
			>
				<div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 pb-2 sm:grid-cols-6">
					<TextInput
						className="sm:col-span-6"
						id="current-password"
						label="Current Password"
						type="password"
						bind:value={currentPassword}
						autocomplete="current-password"
					/>
					<TextInput
						className="sm:col-span-3"
						id="password"
						label="New Password"
						type="password"
						bind:value={newPassword}
						autocomplete="new-password"
					/>
					<TextInput
						className="sm:col-span-3"
						id="confirm-password"
						label="Confirm Password"
						type="password"
						bind:value={confirmPassword}
						autocomplete="new-password"
					/>
				</div>
				<PasswordRequirements {confirmPassword} useConfirmPassword password={newPassword} />
			</form>
			<ErrorText errorText={errorMessages.password} />
			{#snippet actions()}
				<button type="submit" form="changePassword" class="btn btn--primary">Update</button>
			{/snippet}
		</Card>
	</TwoColumn>
	<TwoColumn title={'Profile'}>
		<Card className="md:col-span-2">
			<form>
				<div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
					<!-- <TextArea
						className="sm:col-span-6"
						id="pitch"
						label="60 Second Pitch"
						bind:value={data.user.pitch}
					/> -->
					<Select
						label="What are you looking for?"
						className="sm:col-span-3"
						options={[
							{ id: 'growing', label: 'Growing my skillset' },
							{ id: 'job', label: 'Looking for a job' },
							{ id: 'student', label: 'A student preparing for a career' }
						]}
						bind:value={data.user.lookingFor}
					/>
					<!-- <Select
						id="timezone"
						label="What timezone"
						className="sm:col-span-3"
						options={[
							{ id: 'pst', label: 'Pacific Standard Time' },
							{ id: 'mst', label: 'Mountain Standard Time' },
							{ id: 'cst', label: 'Central Standard Time' },
							{ id: 'est', label: 'Eastern Standard Time' },
							{ id: 'ast', label: 'Atlantic Standard Time' },
							{ id: 'akst', label: 'Alaska Standard Time' },
							{ id: 'hst', label: 'Hawaii-Aleutian Standard Time' },
							{ id: 'gmt', label: 'Greenwich Mean Time' },
							{ id: 'cet', label: 'Central European Time' },
							{ id: 'eet', label: 'Eastern European Time' },
							{ id: 'ist', label: 'India Standard Time' },
							{ id: 'cst-asia', label: 'China Standard Time' },
							{ id: 'jst', label: 'Japan Standard Time' },
							{ id: 'kst', label: 'Korea Standard Time' },
							{ id: 'aest', label: 'Australian Eastern Standard Time' },
							{ id: 'acst', label: 'Australian Central Standard Time' },
							{ id: 'awst', label: 'Australian Western Standard Time' },
							{ id: 'nzst', label: 'New Zealand Standard Time' },
							{ id: 'msk', label: 'Moscow Standard Time' },
							{ id: 'sast', label: 'South Africa Standard Time' }
						]}
						bind:value={data.user.timezone}
					/> -->
				</div>
			</form>
			{#snippet actions()}
				<button
					type="submit"
					class="btn btn--primary"
					onclick={() => {
						updateAccount('profile');
						trackingStore.trackAction('Update Account Click', { type: 'profile' });
					}}>Save</button
				>
			{/snippet}
		</Card>
	</TwoColumn>
	<TwoColumn title="Delete Your Account">
		<Card>
			<p class="pb-2">
				If you’re sure you’d like to leave Career Fingerprint, deleting your account will
				permanently remove your access.
			</p>
			{#snippet actions()}
				<button
					class="btn btn--error"
					onclick={() => {
						deleteUserFunc();
						trackingStore.trackAction('Delete Account Click');
					}}>Delete Account</button
				>
			{/snippet}
		</Card>
	</TwoColumn>
</PageContainer>
