<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { useDeleteUserMutation } from '$lib/API/user.js';
	import Card from '$lib/Components/Containers/Card.svelte';
	import PageContainer from '$lib/Components/Containers/PageContainer.svelte';
	import TwoColumn from '$lib/Components/Containers/TwoColumn.svelte';
	import ImageUpload from '$lib/Components/FormElements/ImageUpload.svelte';
	import Select from '$lib/Components/FormElements/Select.svelte';
	import TextArea from '$lib/Components/FormElements/TextArea.svelte';
	import TextInput from '$lib/Components/FormElements/TextInput.svelte';
	import { toastStore } from '$lib/Components/Toasts/toast.js';

	const { data } = $props();

	let newPassword = $state(null);
	let confirmPassword = $state(null);

	const deleteUserMutation = useDeleteUserMutation();

	function getUserData(saveType: 'profile' | 'password' | 'account') {
		switch (saveType) {
			case 'account':
				return {
					firstName: data.user.firstName,
					lastName: data.user.lastName,
					profileImage: data.user.profileImage,
					email: data.user.email
				};
			case 'password':
				return {
					password: newPassword
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

	async function updateAccount(saveType: 'profile' | 'password' | 'account') {
		const url = `${PUBLIC_API_URL}/users/${data.user.id}`;

		const res = await fetch(url, {
			method: 'PATCH',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json' // Set content type to JSON
			},
			body: JSON.stringify(getUserData(saveType))
		});

		if (res.ok) {
			toastStore.show({
				type: 'success',
				message: `User saved`
			});
		} else {
			toastStore.show({
				type: 'error',
				message: `Error updating User`
			});
		}
	}

	async function deleteUserFunc() {
		try {
			await $deleteUserMutation.mutateAsync();
			toastStore.show({ message: 'User deleted', type: 'success' });
			goto('/logout');
		} catch (error) {
			toastStore.show({ message: 'Cant delete user', type: 'error' });
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
						className="sm:col-span-6"
						id="email"
						label="Email"
						placeholder="adunham95@gmail.com"
						bind:value={data.user.email}
					/>
				</div>
			</form>
			{#snippet actions()}
				<button type="submit" class="btn btn--primary" onclick={() => updateAccount('account')}
					>Update</button
				>
			{/snippet}
		</Card>
	</TwoColumn>
	<TwoColumn title={'Password'}>
		<Card className="md:col-span-2">
			<form>
				<div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
					<TextInput
						className="sm:col-span-3"
						id="password"
						label="Password"
						bind:value={newPassword}
					/>
					<TextInput
						className="sm:col-span-3"
						id="confirm-password"
						label="Confirm Password"
						bind:value={confirmPassword}
					/>
				</div>
			</form>
			{#snippet actions()}
				<button type="submit" class="btn btn--primary" onclick={() => updateAccount('password')}
					>Update</button
				>
			{/snippet}
		</Card>
	</TwoColumn>
	<TwoColumn title={'Profile'}>
		<Card className="md:col-span-2">
			<form>
				<div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
					<TextArea
						className="sm:col-span-6"
						id="pitch"
						label="60 Second Pitch"
						bind:value={data.user.pitch}
					/>
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
					<Select
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
					/>
				</div>
			</form>
			{#snippet actions()}
				<button type="submit" class="btn btn--primary" onclick={() => updateAccount('profile')}
					>Save</button
				>
			{/snippet}
		</Card>
	</TwoColumn>
	<TwoColumn title="Delete Your Account">
		<Card>
			<p class="pb-2">If you no longer want to use our service</p>
			{#snippet actions()}
				<button class="btn btn--error" onclick={deleteUserFunc}>Delete Account</button>
			{/snippet}
		</Card>
	</TwoColumn>
</PageContainer>
