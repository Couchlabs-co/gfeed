<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';

	/** @type {import('./$types').PageData} */
	export let data: PageData;
	console.log(data);

</script>
<div class="flex mt-4 rounded bg-gray-200 items-center justify-center gap-2 overflow-x-hidden">
	<section>
		<div class="max-w-screen-xl px-4 py-8 mx-auto sm:py-12 sm:px-6 lg:px-8">
		  <div class="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-stretch">
			<div class="grid p-6 bg-gray-100 rounded place-content-center sm:p-8">
			  <div class="max-w-md mx-auto text-center lg:text-left">
				<div class="avatar">
					<div class="w-48 rounded-full">
					  <img src={$page.data.session?.user?.image} alt={$page.data.session?.user?.name} />
					</div>
				</div>
	  
				<p>
				 <span class="text-2xl font-bold text-gray-900">{$page.data.session?.user?.name}</span>
				 <span class="text-2xl font-bold text-gray-900">{$page.data.session?.user?.id}</span>
				</p>
				<ul class="menu w-56 rounded-box mt-4">
					<li>
					  <a href="/profile">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
					  	Settings
					  </a>
					</li>
					<li>
					  <a href="/profile">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
						Link 2
					  </a>
					</li>
					<li>
					  <a href="/profile">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
						Item 3
					  </a>
					</li>
				  </ul>
			  </div>
			</div>

			<div class="card w-96 bg-neutral text-neutral-content">
				<div class="card-body items-center text-center">
				  <h2 class="card-title">You follow you interests</h2>
				  {#if !data.interests.length || data.interests?.likes.length === 0}
				  	<p>You have not selected any interests yet.</p>
				  {:else}
					<ul>
						{#each data.interests.likes as like}
							<li>{like}</li>
						{/each}
					</ul>
				  {/if}
				</div>
			</div>

			<div class="card w-96 bg-neutral text-neutral-content">
				<div class="card-body items-center text-center">
				  <h2 class="card-title">Not for me</h2>
				  {#if !data.interests.length || data.interests?.dislikes.length === 0}
				  	<p>You have not disliked anything yet.</p>
				  {:else}
					<ul>
						{#each data.interests.dislikes as dislike}
							<li>{dislike}</li>
						{/each}
					</ul>
				  {/if}
				</div>
			</div>
	  
		  </div>
		</div>
	</section>
</div>
