<script lang="ts">
	import { useAddThankYouMutation } from '$lib/API/thankYouNotes';
	import ErrorText from '../FormElements/ErrorText.svelte';
	import Label from '../FormElements/Label.svelte';
	import TextArea from '../FormElements/TextArea.svelte';
	import TextInput from '../FormElements/TextInput.svelte';
	import { toastStore } from '../Toasts/toast';

	interface Props {
		meetingID: string;
		onSuccess?: () => void;
		formID: string;
	}

	const { meetingID, onSuccess, formID }: Props = $props();

	let thankYouMessage = $state('');
	let contacts = $state<{ firstName: string; email: string }[]>([]);
	let thankYouErrors = $state<{ [key: string]: string }>({});

	let thankYouNotesMutation = useAddThankYouMutation(meetingID);

	function removeContact(idx: number) {
		console.log(idx);
		contacts = contacts.filter((_, i) => i !== idx);
	}

	function sendThankYouNote() {
		thankYouErrors = {};
		try {
			if (contacts.length <= 0) {
				thankYouErrors['contacts'] = 'No Contacts';
				return;
			}
			if (thankYouMessage === '') {
				thankYouErrors['message'] = 'Missing Thank You Message';
				return;
			}
			$thankYouNotesMutation.mutateAsync({
				message: thankYouMessage,
				contacts,
				meetingID: meetingID
			});
			toastStore.show({ message: 'Sent Thank Notes', type: 'success' });
			onSuccess?.();
		} catch (error) {
			toastStore.show({ message: 'Could not send thank you note', type: 'error' });
		}
	}
</script>

<form
	id={formID}
	class="grid grid-cols-2 gap-x-2"
	onsubmit={(e) => {
		e.preventDefault();
		sendThankYouNote();
	}}
>
	<TextArea
		id="thank-you-note"
		label="Thank You Note"
		rows={5}
		bind:value={thankYouMessage}
		placeholder="Thank you for the interview today. I appreciated the chance to hear more about the position and how the team works. Please let me know if you need anything else from me as you move forward."
		errorText={thankYouErrors.message}
	/>
	<div>
		<Label id="idx" label="Add Contacts" />
		{#if thankYouErrors.contacts}
			<ErrorText errorText={thankYouErrors.contacts} />
		{/if}
		<div class=" max-h-32 space-y-2 overflow-y-auto">
			{#each contacts as contact, idx}
				<div class="flex gap-x-1">
					<TextInput id="firstName" placeholder="First Name" bind:value={contact.firstName} />
					<TextInput id="email" placeholder="Email" bind:value={contact.email} />
					<button
						class="btn btn-text--error btn-small"
						type="button"
						onclick={() => removeContact(idx)}
					>
						<span class="sr-only"> Delete </span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="size-4"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
							/>
						</svg>
					</button>
				</div>
			{/each}
			<button
				type="button"
				class="w-full rounded-md border border-gray-400 p-2 text-center text-sm hover:bg-gray-400"
				onclick={() => contacts.push({ firstName: '', email: '' })}
			>
				Add Contact
			</button>
		</div>
	</div>
</form>
