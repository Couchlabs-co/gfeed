<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';

	/** @type {import('./$types').PageData} */
	export let data: PageData;

</script>
<div class="flex mt-4 rounded bg-gray-200 items-center justify-center gap-2 overflow-x-hidden">
	<section>
		<div class="max-w-screen-xl px-4 py-8 mx-auto sm:py-12 sm:px-6 lg:px-8">
		  <div class="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-stretch">
			<div class="grid p-6 bg-gray-100 rounded place-content-center sm:p-8">
			  <div class="max-w-md mx-auto text-center lg:text-left">
				<div class="avatar">
					<div class="w-24 rounded-full">
					  <img src={$page.data.session?.user?.image} alt={$page.data.session?.user?.name} />
					</div>
				</div>
	  
				<p>
				 <span class="text-2xl font-bold text-gray-900">{$page.data.session?.user?.name}</span>
				</p>
			  </div>
			</div>

			<div class="card w-96 bg-neutral text-neutral-content">
				<div class="card-body items-center text-center">
				  <h2 class="card-title">You follow you interests</h2>
				  <ul>
					{#each data.interests.likes as like}
						<li>{like}</li>
					{/each}
				  </ul>
				</div>
			</div>

			<div class="card w-96 bg-neutral text-neutral-content">
				<div class="card-body items-center text-center">
				  <h2 class="card-title">Not for me</h2>
				  <ul>
					{#each data.interests.dislikes as dislike}
						<li>{dislike}</li>
					{/each}
				  </ul>
				</div>
			</div>
	  
		  </div>
		</div>
	  </section>

</div>
