<script lang="ts">
	import { page } from '$app/stores';
</script>
<div class="flex mt-4 rounded bg-gray-200 items-center justify-center gap-2 overflow-x-hidden">
	<div class="card w-96 bg-base-100 shadow-xl">
	<figure><img src={$page.data.session?.user?.image} alt={$page.data.session?.user?.name} /></figure>
	<div class="card-body">
		<h2 class="card-title">{$page.data.session?.user?.name}</h2>
		<p>What you like</p>
		<div class="card-actions justify-end">
		</div>
	</div>
	</div>
</div>

<!-- <div>
	<div class="px-4 sm:px-0">
		<h3 class="text-base font-semibold leading-7 text-gray-900">Applicant Information</h3>
		<p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Personal details and application.</p>
	</div>
	<div class="mt-6 border-t border-gray-100">
		<dl class="divide-y divide-gray-100">
			<div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
				<dt class="text-sm font-medium leading-6 text-gray-900">Full name</dt>
				<dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">Margot Foster</dd>
			</div>
			<div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
				<dt class="text-sm font-medium leading-6 text-gray-900">Application for</dt>
				<dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
					Backend Developer
				</dd>
			</div>
			<div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
				<dt class="text-sm font-medium leading-6 text-gray-900">Email address</dt>
				<dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
					margotfoster@example.com
				</dd>
			</div>
			<div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
				<dt class="text-sm font-medium leading-6 text-gray-900">Salary expectation</dt>
				<dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">$120,000</dd>
			</div>
			<div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
				<dt class="text-sm font-medium leading-6 text-gray-900">About</dt>
				<dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
					Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim incididunt cillum culpa
					consequat. Excepteur qui ipsum aliquip consequat sint. Sit id mollit nulla mollit nostrud
					in ea officia proident. Irure nostrud pariatur mollit ad adipisicing reprehenderit
					deserunt qui eu.
				</dd>
			</div>
		</dl>
	</div>
</div> -->
