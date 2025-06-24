// src/lib/stores/toastStore.ts
import { writable } from 'svelte/store';

export type Toast = {
	id: string;
	message: string;
	details?: string;
	type?: 'success' | 'error' | 'info' | 'warning';
	duration?: number;
};

function createToastStore() {
	const { subscribe, update } = writable<Toast[]>([]);

	function show(toast: Omit<Toast, 'id'>) {
		const id = crypto.randomUUID();
		const duration = toast.duration ?? 3000;

		update((toasts) => [...toasts, { type: 'info', ...toast, id }]);

		setTimeout(() => {
			remove(id);
		}, duration);

		return id;
	}

	function success(toast: Omit<Toast, 'id' | 'type'>) {
		const id = crypto.randomUUID();
		const duration = toast.duration ?? 3000;

		update((toasts) => [...toasts, { ...toast, id, type: 'success' }]);

		setTimeout(() => {
			remove(id);
		}, duration);

		return id;
	}

	function remove(id: string) {
		update((toasts) => toasts.filter((t) => t.id !== id));
	}

	return {
		subscribe,
		show,
		remove,
		success
	};
}

export const toastStore = createToastStore();
