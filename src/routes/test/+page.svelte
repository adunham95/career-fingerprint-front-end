<script>
	// Mock data matching the screenshot structure
	const achievements = [
		{
			id: 1,
			action: 'Senior Debugging Therapist',
			situation: 'We received feedback on how to improve our throughput',
			result: 'We have a demo at work. Our team demoed our application to our team.',
			company: 'Action Testing',
			startTime: null,
			starred: true
		},
		{
			id: 2,
			action: 'Mentor coaching relationships organized',
			situation: null,
			result: null,
			company: null,
			startTime: null,
			starred: true
		},
		{
			id: 3,
			action: 'Mentor coaching relationships organized',
			situation: null,
			result: null,
			company: null,
			startTime: null,
			starred: false
		},
		{
			id: 4,
			action: 'Presented my project to leadership',
			situation: 'I want to present my project',
			result: 'Talked to my manager about presenting to leadership',
			company: null,
			startTime: 'February 2nd, 2026',
			starred: false
		},
		{
			id: 5,
			action: 'The tool was recommended by my team',
			situation: null,
			result: 'I designed a new tool',
			company: null,
			startTime: 'November 29th, 2025',
			starred: false
		},
		{
			id: 6,
			action: 'Was selected by committee',
			situation: 'Assisted in the client strategy in creating a client product',
			result: null,
			company: null,
			startTime: 'November 27th, 2025',
			starred: false
		},
		{
			id: 7,
			action: 'Added the assignment',
			situation:
				'The client was missing an assignment. Collaborated with my team to design a solution to fix the missing assignment.',
			result: null,
			company: 'Senior Debugging Therapist',
			startTime: 'November 26th, 2025',
			starred: false
		},
		{
			id: 8,
			action: 'I have a result. Did a task.',
			situation: null,
			result: 'I have a citation',
			company: 'Senior Debugging Therapist',
			startTime: 'July 14th, 2024',
			starred: false
		}
	];

	// Group by startTime (null items go at top as "Undated")
	function groupAchievements(list) {
		const groups = {};
		for (const a of list) {
			const key = a.startTime || '__undated__';
			if (!groups[key]) groups[key] = [];
			groups[key].push(a);
		}
		// Sort: dated groups descending, undated first
		const dated = Object.entries(groups)
			.filter(([k]) => k !== '__undated__')
			.sort((a, b) => new Date(b[0]) - new Date(a[0]));
		const result = [];
		if (groups['__undated__']) result.push(['__undated__', groups['__undated__']]);
		result.push(...dated);
		return result;
	}

	$: grouped = groupAchievements(achievements);

	let expandedId = null;
	function toggle(id) {
		expandedId = expandedId === id ? null : id;
	}
</script>

<div class="page">
	<div class="page-header">
		<h1 class="page-title">My Achievement Timeline</h1>
		<button class="add-btn">
			<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
				<path d="M7 1v12M1 7h12" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
			</svg>
			Add Achievement
		</button>
	</div>

	{#each grouped as [dateKey, items]}
		<div class="group">
			<div class="group-label">
				{dateKey === '__undated__' ? 'No Date' : dateKey}
			</div>

			{#each items as a (a.id)}
				{@const hasDetail = a.situation || a.result || a.company}
				{@const isOpen = expandedId === a.id}

				<div class="card">
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div class="card-top" on:click={() => hasDetail && toggle(a.id)}>
						<!-- Star -->
						<button
							class="star-btn {a.starred ? 'starred' : ''}"
							on:click|stopPropagation={() => (a.starred = !a.starred)}
							aria-label="Toggle star"
						>
							<svg
								width="16"
								height="16"
								viewBox="0 0 16 16"
								fill={a.starred ? 'currentColor' : 'none'}
								stroke="currentColor"
								stroke-width="1.5"
							>
								<path
									d="M8 1.5l1.8 3.6 4 .58-2.9 2.83.69 3.99L8 10.35l-3.59 1.88.69-3.99L2.2 5.68l4-.58L8 1.5z"
								/>
							</svg>
						</button>

						<!-- Main content -->
						<div class="card-main">
							<p class="action-text">{a.action}</p>

							<!-- Pill indicators -->
							{#if a.company || a.startTime || a.situation || a.result}
								<div class="meta-row">
									{#if a.company}
										<span class="pill pill-company">
											<svg width="10" height="10" viewBox="0 0 10 10" fill="none"
												><circle
													cx="5"
													cy="3.5"
													r="2"
													stroke="currentColor"
													stroke-width="1.2"
												/><path
													d="M1.5 8.5c0-1.93 1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5"
													stroke="currentColor"
													stroke-width="1.2"
													stroke-linecap="round"
												/></svg
											>
											{a.company}
										</span>
									{/if}
									{#if a.startTime && dateKey === '__undated__'}
										<span class="pill pill-time">
											<svg width="10" height="10" viewBox="0 0 10 10" fill="none"
												><circle
													cx="5"
													cy="5"
													r="3.5"
													stroke="currentColor"
													stroke-width="1.2"
												/><path
													d="M5 3v2.5l1.5 1"
													stroke="currentColor"
													stroke-width="1.2"
													stroke-linecap="round"
												/></svg
											>
											{a.startTime}
										</span>
									{/if}
									{#if a.situation}
										<span class="pill pill-situation">Situation</span>
									{/if}
									{#if a.result}
										<span class="pill pill-result">Result</span>
									{/if}
								</div>
							{/if}
						</div>

						<!-- Edit -->
						<button
							class="edit-btn"
							on:click|stopPropagation={() => {
								/* navigate to edit */
							}}
							aria-label="Edit achievement"
						>
							<svg width="15" height="15" viewBox="0 0 15 15" fill="none">
								<path
									d="M10.5 2.5l2 2-7.5 7.5H3v-2L10.5 2.5z"
									stroke="currentColor"
									stroke-width="1.4"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
						</button>

						<!-- Chevron -->
						{#if hasDetail}
							<svg
								class="chevron {isOpen ? 'open' : ''}"
								width="16"
								height="16"
								viewBox="0 0 16 16"
								fill="none"
							>
								<path
									d="M4 6l4 4 4-4"
									stroke="currentColor"
									stroke-width="1.5"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
						{/if}
					</div>

					<!-- Expandable detail -->
					{#if hasDetail}
						<div class="card-detail {isOpen ? 'open' : ''}">
							{#if a.situation}
								<div class="detail-section">
									<div class="detail-label label-situation">Situation</div>
									<div class="detail-text">{a.situation}</div>
								</div>
								{#if a.result || a.company}<div class="detail-divider"></div>{/if}
							{/if}
							{#if a.result}
								<div class="detail-section">
									<div class="detail-label label-result">Result</div>
									<div class="detail-text">{a.result}</div>
								</div>
								{#if a.company}<div class="detail-divider"></div>{/if}
							{/if}
							{#if a.company}
								<div class="detail-section">
									<div class="detail-label label-company">Company / Role</div>
									<div class="detail-text">{a.company}</div>
								</div>
							{/if}
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/each}
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Josefin+Sans:wght@300;400;600&display=swap');

	:global(body) {
		margin: 0;
		background: #fdfaf9;
		font-family: 'Josefin Sans', sans-serif;
	}

	.page {
		max-width: 680px;
		margin: 0 auto;
		padding: 24px 16px 80px;
	}

	/* ── Header ── */
	.page-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 28px;
	}
	.page-title {
		font-family: 'Libre Baskerville', serif;
		font-size: 22px;
		color: #113a5d;
		margin: 0;
	}
	.add-btn {
		display: flex;
		align-items: center;
		gap: 6px;
		background: #113a5d;
		color: #fdfaf9;
		border: none;
		border-radius: 8px;
		padding: 9px 16px;
		font-family: 'Josefin Sans', sans-serif;
		font-size: 13px;
		font-weight: 600;
		letter-spacing: 0.04em;
		cursor: pointer;
		transition: background 0.15s;
	}
	.add-btn:hover {
		background: #0d2d47;
	}
	.add-btn svg {
		flex-shrink: 0;
	}

	/* ── Group header ── */
	.group {
		margin-bottom: 36px;
	}
	.group-label {
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #113a5d;
		opacity: 0.45;
		margin-bottom: 12px;
		padding-left: 4px;
	}

	/* ── Card ── */
	.card {
		background: #fff;
		border: 1px solid #e8e2de;
		border-radius: 12px;
		margin-bottom: 10px;
		overflow: hidden;
		transition:
			box-shadow 0.15s,
			border-color 0.15s;
	}
	.card:hover {
		box-shadow: 0 2px 12px rgba(17, 58, 93, 0.08);
		border-color: #c8c0bb;
	}
	.card-top {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		padding: 14px 16px;
		cursor: pointer;
	}

	/* Star */
	.star-btn {
		background: none;
		border: none;
		padding: 2px;
		cursor: pointer;
		color: #c8c0bb;
		flex-shrink: 0;
		margin-top: 1px;
		transition:
			color 0.15s,
			transform 0.15s;
	}
	.star-btn:hover {
		transform: scale(1.15);
	}
	.star-btn.starred {
		color: #ffb800;
	}

	/* Action (primary text) */
	.card-main {
		flex: 1;
		min-width: 0;
	}
	.action-text {
		font-family: 'Libre Baskerville', serif;
		font-size: 14px;
		color: #113a5d;
		line-height: 1.45;
		margin: 0 0 6px;
	}

	/* Pill row */
	.meta-row {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		align-items: center;
	}
	.pill {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		border-radius: 20px;
		padding: 3px 9px;
	}
	.pill-company {
		background: rgba(17, 58, 93, 0.08);
		color: #113a5d;
	}
	.pill-time {
		background: rgba(0, 191, 166, 0.1);
		color: #00816e;
	}
	.pill-result {
		background: rgba(255, 122, 138, 0.12);
		color: #c94057;
	}
	.pill-situation {
		background: rgba(255, 184, 0, 0.12);
		color: #7a5800;
	}

	/* Edit button */
	.edit-btn {
		background: none;
		border: none;
		padding: 4px;
		cursor: pointer;
		color: #c8c0bb;
		flex-shrink: 0;
		border-radius: 6px;
		transition:
			color 0.15s,
			background 0.15s;
	}
	.edit-btn:hover {
		color: #113a5d;
		background: rgba(17, 58, 93, 0.07);
	}

	/* Expand chevron */
	.chevron {
		flex-shrink: 0;
		color: #b0a8a2;
		transition: transform 0.2s;
		margin-top: 2px;
	}
	.chevron.open {
		transform: rotate(180deg);
	}

	/* Expanded detail */
	.card-detail {
		border-top: 1px solid #f0ebe7;
		padding: 0 16px;
		overflow: hidden;
		max-height: 0;
		transition:
			max-height 0.25s ease,
			padding 0.2s;
	}
	.card-detail.open {
		max-height: 400px;
		padding: 14px 16px 16px;
	}

	.detail-section {
		margin-bottom: 12px;
	}
	.detail-section:last-child {
		margin-bottom: 0;
	}
	.detail-label {
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		margin-bottom: 4px;
	}
	.label-situation {
		color: #7a5800;
	}
	.label-result {
		color: #c94057;
	}
	.label-company {
		color: #113a5d;
	}

	.detail-text {
		font-size: 13px;
		color: #3a3530;
		line-height: 1.55;
	}

	/* Divider inside detail */
	.detail-divider {
		height: 1px;
		background: #f0ebe7;
		margin: 12px 0;
	}
</style>
