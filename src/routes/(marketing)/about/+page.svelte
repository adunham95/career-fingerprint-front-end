<script lang="ts"></script>

<div class=" px-6 py-24 sm:py-32 lg:px-8 xl:mx-auto xl:max-w-7xl">
	<div class="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
		<h2
			class="font-title text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl"
		>
			Our Mission
		</h2>
		<div class="mt-6 flex flex-col gap-x-8 gap-y-20 lg:flex-row">
			<div class="lg:w-full lg:max-w-2xl lg:flex-auto">
				<p class="text-xl/8 text-gray-600">
					We aim to employer all current employees and perspective employees with all the tools they
					need to gow in there career<super class=" align-super text-[10px]">Work in progress</super
					>
				</p>
				<!-- <p class="mt-10 max-w-xl text-base/7 text-gray-700">
					Faucibus commodo massa rhoncus, volutpat. Dignissim sed eget risus enim. Mattis mauris
					semper sed amet vitae sed turpis id. Id dolor praesent donec est. Odio penatibus risus
					viverra tellus varius sit neque erat velit. Faucibus commodo massa rhoncus, volutpat.
					Dignissim sed eget risus enim. Mattis mauris semper sed amet vitae sed turpis id.
				</p> -->
			</div>
			<!-- <div class="lg:flex lg:flex-auto lg:justify-center">
					<dl class="w-64 space-y-8 xl:w-80">
						<div class="flex flex-col-reverse gap-y-4">
							<dt class="text-base/7 text-gray-600">Transactions every 24 hours</dt>
							<dd class="text-5xl font-semibold tracking-tight text-gray-900">44 million</dd>
						</div>
						<div class="flex flex-col-reverse gap-y-4">
							<dt class="text-base/7 text-gray-600">Assets under holding</dt>
							<dd class="text-5xl font-semibold tracking-tight text-gray-900">$119 trillion</dd>
						</div>
						<div class="flex flex-col-reverse gap-y-4">
							<dt class="text-base/7 text-gray-600">New users annually</dt>
							<dd class="text-5xl font-semibold tracking-tight text-gray-900">46,000</dd>
						</div>
					</dl>
				</div> -->
		</div>
	</div>

	<div class="mx-auto max-w-2xl pt-24 sm:pt-32 lg:mx-0 lg:max-w-none">
		<h2
			class="font-title pb-6 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl"
		>
			Our Starting Point
		</h2>
		<p class="text-xl/8 text-gray-600">
			Skill Fingerprint started when Adrian was job searching and needed a place to take note of all
			his career achievements and realized there was only two solutions. A spreadsheet or a
			notebook. It was after that he started building the foundations for Skill Fingerprint
		</p>
	</div>

	<!-- Image Section -->
	<div class="mt-32 sm:mt-40 xl:px-8">
		<img
			src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80"
			alt=""
			class="aspect-5/2 w-full rounded object-cover xl:rounded-3xl"
		/>
	</div>

	<!-- Team Section -->
	<div>
		{@render teamList([
			{ name: 'Adrian Dunham', imgURL: 'images/AdrianHeadshot.jpeg', title: 'Founder/CEO' },
			{ name: 'Emelie Dunham', imgURL: '', title: 'Co-Founder' }
		])}
	</div>
</div>

{#snippet teamList(teamMembers: { name: string; imgURL: string; title: string }[])}
	<div class=" grid gap-20 py-24 sm:py-32 xl:grid-cols-3">
		<div class="max-w-xl">
			<h2
				class="font-title text-3xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-4xl"
			>
				Our Team
			</h2>
			<p class="mt-6 text-lg/8 text-gray-600">
				We’re a dynamic group of individuals who are passionate about what we do and dedicated to
				delivering the best results for our clients.
			</p>
		</div>
		<ul role="list" class="grid gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-16 xl:col-span-2">
			{#each teamMembers as teamMate}
				<li>
					<div class="flex items-center gap-x-6">
						<img class="size-16 rounded-full" src={teamMate.imgURL} alt="" />
						<div>
							<h3 class="text-lg font-semibold tracking-tight text-gray-900">
								{teamMate.name}
							</h3>
							<p class="text-primary text-sm/6 font-semibold">{teamMate.title}</p>
						</div>
					</div>
				</li>
			{/each}
		</ul>
	</div>
{/snippet}
