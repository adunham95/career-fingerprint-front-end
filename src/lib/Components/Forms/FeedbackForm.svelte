<script lang="ts">
	import { useCreateFeedbackMutation } from '$lib/API/feedback';
	import StarRating from '../FormElements/StarRating.svelte';
	import TextArea from '../FormElements/TextArea.svelte';
	import Toggle from '../FormElements/Toggle.svelte';
	import { toastStore } from '../Toasts/toast';

	interface Props {
		formID: string;
		userID: number;
		onSuccess?: () => void;
	}

	const { formID, userID, onSuccess }: Props = $props();

	let rating = $state(0);
	let suggestions = $state('');
	let contact = $state(false);

	let newFeedback = useCreateFeedbackMutation();

	async function submitFeedback(e: SubmitEvent) {
		e.preventDefault();
		try {
			$newFeedback.mutateAsync({
				userID,
				feedback: suggestions,
				rating,
				contact,
				page: window.location.href,
				device: navigator.userAgent
			});
			toastStore.show({ message: 'Feedback saved' });
			onSuccess?.();
		} catch (error) {
			toastStore.show({ message: 'Error saving feedback', type: 'error' });
		}
	}
</script>

<form id={formID} onsubmit={(e) => submitFeedback(e)} class=" space-y-4 divide-y divide-gray-200">
	<StarRating
		id="star-rating"
		label="How would you rate your overall experience on this page?"
		bind:rating
		className="pb-4"
		hideValue
	/>
	<TextArea
		className="pb-4"
		id="feedback"
		label="Any suggestions, questions, or ideas for this page?"
		placeholder="Type feedback here....."
		bind:value={suggestions}
	/>
	<Toggle
		className="pb-4"
		id="allow-contact"
		label="Would you be open to a follow-up interview or testing session?"
		bind:checked={contact}
	/>
</form>
