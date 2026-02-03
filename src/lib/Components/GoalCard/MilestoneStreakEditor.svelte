<script lang="ts">
	import { onDestroy } from 'svelte';
	import { useCheckoffMilestone, useGetMilestoneDetails } from '$lib/API/goals';
	import type { BaseMilestoneEditorProps } from './milestoneEditorBase';
	import { format } from 'date-fns';

	interface Props extends BaseMilestoneEditorProps {}
	const { milestone }: Props = $props();

	const milestoneData = useGetMilestoneDetails(milestone.id, 'streak');
	const checkInMutation = useCheckoffMilestone(milestone.id, 'streak');

	async function checkIn() {
		try {
			await $checkInMutation.mutateAsync({
				milestoneID: milestone.id,
				type: 'streak',
				body: { checked: true }
			});
		} catch (error) {}
	}

	// --- count up (0 -> current streak) on success screen ---
	let displayStreak = $state(0);
	let raf: number | null = null;

	function easeOutCubic(t: number) {
		return 1 - Math.pow(1 - t, 3);
	}

	function startCountUp(to: number, duration = 650) {
		console.log('start count up');
		if (raf) cancelAnimationFrame(raf);
		displayStreak = 0;

		const start = performance.now();
		const tick = (now: number) => {
			console.log(now);
			const t = Math.min(1, (now - start) / duration);
			displayStreak = Math.round(to * easeOutCubic(t));
			if (t < 1) raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
	}

	// reactive: when we land in success state, run count-up once
	let didAnimate = false;
	$effect(() => {
		const data = $milestoneData.data?.streak;
		console.log(data?.currentStreak);
		if (!data) return;

		const isSuccess = Boolean(data.hasCheckInThisWeek);
		const current = data.currentStreak ?? 10;

		if (isSuccess && !didAnimate) {
			didAnimate = true;
			startCountUp(current);
		}

		// if user hasn't checked in yet, reset so it animates next success
		if (!isSuccess) {
			didAnimate = false;
			displayStreak = current;
		}
	});

	onDestroy(() => {
		if (raf) cancelAnimationFrame(raf);
	});
</script>

<div class="flex flex-1 flex-col items-center justify-center text-center">
	{#if $milestoneData.isLoading}
		<div class="py-10 text-sm text-slate-500">Loading streak…</div>
	{:else}
		{@const streak = $milestoneData.data?.streak}
		{@const hasCheckedIn = Boolean(streak?.hasCheckInThisWeek)}
		{@const current = streak?.currentStreak ?? 0}

		<!-- Icon + low-key celebration ring -->
		<div class="bg-primary-100 mb-4 flex h-14 w-14 items-center justify-center rounded-full">
			<div class="bg-primary-900/10 flex h-9 w-9 items-center justify-center rounded-full">
				<!-- Check icon -->
				<svg viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5 text-slate-900">
					<path
						fill-rule="evenodd"
						d="M16.704 5.29a1 1 0 010 1.415l-7.25 7.25a1 1 0 01-1.414 0l-3.25-3.25A1 1 0 016.204 9.29l2.543 2.543 6.543-6.543a1 1 0 011.414 0z"
						clip-rule="evenodd"
					/>
				</svg>
			</div>
		</div>

		<p class="text-xs font-semibold tracking-[0.22em] uppercase">Streak Goal</p>

		{#if !hasCheckedIn}
			<!-- PRE-CHECKIN -->
			<h3 class="mt-2 text-lg font-semibold text-slate-900">Check in for this week?</h3>
			<p class="mt-2 max-w-sm text-sm text-slate-600">
				One tap to keep your streak alive — we’ll update your overall progress.
			</p>

			<div class="flex flex-col justify-center pt-4">
				<p class="text-5xl font-bold text-slate-900 tabular-nums">{current}</p>
				<p class="mt-2 text-sm text-slate-500">Week streak</p>
			</div>

			{#if streak?.lastCheckIn}
				<div
					class="mt-6 flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600"
				>
					<span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
					<span>Last check-in:</span>
					<time datetime={streak.lastCheckIn} class="font-medium text-slate-700">
						{format(streak.lastCheckIn, 'PPpp')}
					</time>
				</div>
			{/if}

			<button
				type="button"
				class="btn btn--primary mt-7 w-full disabled:opacity-60"
				onclick={checkIn}
				disabled={$checkInMutation.isPending}
			>
				{$checkInMutation.isPending ? 'Checking in…' : 'Check in for this week'}
			</button>
		{:else}
			<!-- SUCCESS -->
			<h3 class="mt-2 text-xl font-semibold text-slate-900">Checked in — nice work.</h3>
			<p class="mt-2 max-w-sm text-sm text-slate-600">
				You showed up this week. That’s how habits stick.
			</p>

			<div class="mt-6 flex flex-col items-center justify-center">
				<p
					class="animate-[streakPop_420ms_cubic-bezier(0.2,0.8,0.2,1)_both] text-6xl font-bold text-slate-900
					tabular-nums"
				>
					{displayStreak}
				</p>
				<p class="mt-2 text-sm font-medium text-slate-600">Week streak</p>
			</div>

			{#if streak?.lastCheckIn}
				<div class="mt-6 text-xs text-slate-500">
					Last check-in: <time datetime={streak.lastCheckIn} class="font-medium text-slate-700">
						{format(streak.lastCheckIn, 'PPpp')}
					</time>
				</div>
			{/if}
		{/if}
	{/if}
</div>

<!-- Tailwind-only keyframes via arbitrary animate names.
     Put these in your global CSS if you prefer; otherwise keep as-is:
     - scaleIn
     - streakPop
-->
<style>
	@keyframes scaleIn {
		0% {
			transform: scale(0.88);
			opacity: 0;
		}
		60% {
			transform: scale(1.06);
			opacity: 1;
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}
	@keyframes streakPop {
		0% {
			transform: translateY(2px) scale(0.98);
			opacity: 0;
		}
		100% {
			transform: translateY(0) scale(1);
			opacity: 1;
		}
	}
</style>
