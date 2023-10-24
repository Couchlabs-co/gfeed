<script lang="ts">
	import { readingListStore } from '../../store';
	import ListItem from '$lib/components/feed/ListItem.svelte';

	/** @type {import('./$types').PageData} */
	export let data;
	const { publishers, feed, session } = data;

	let readingFeed: any = feed.Items;

	const user_id = session ? session.user.id.indexOf('|') > 0 ? session.user?.id.split('|')[1] : session.user?.id : 0;

	if(feed.count){
		$readingListStore.articles = feed.Items;
		readingFeed = feed.Items;
	}

	const filterFeed = (e: any) => {
		const publisher = e.target.value;
		if(publisher !== 'Publishers'){
			readingFeed = feed.Items.filter((item: any) => item.publisher === publisher);
		} else {
			readingFeed = feed.Items;
		}
	}

</script>

<div class="flex flex-row">
	{#if feed.Count === 0}
		<div class="w-10/12 m-auto">
			<h2 class="notFoundText">No articles found.</h2>
		</div>
	{/if}
	{#if !feed}
		<div class="w-10/12 m-auto">
			<span class="loading loading-infinity loading-lg" />
		</div>
	{/if}
	{#if feed.Count > 0}
		<div class="flex flex-col w-10/12">
			{#if readingFeed.length === 0}
				<div class="w-10/12 m-auto">
					<h2 class="notFoundText">No new articles published in last 7 days</h2>
				</div>
			{:else}
				{#each readingFeed as Item}
					<ListItem Item ={Item} userId={user_id}/>
				{/each}
			{/if}
		</div>
		<div class="sidePanel">
			<h2 class="sidePanelHeading">Filters</h2>
				<div class="flex flex-row m-4">
					<select class="select select-bordered w-full max-w-xs" on:change={filterFeed}>
						<option selected>Publishers</option>
						{#each publishers.Items as publisher}
							<option>{publisher.name}</option>
						{/each}
					</select>
				</div>
		</div>
	{/if}
</div>

<style>
	.sidePanel {
		margin-left: 2;
		width: 30%;
		height: 100%;
		overflow-x: hidden;
		padding-top: 20px;
		display: flexbox;
	}

	.sidePanelHeading {
		padding: 16px;
		color: #1a202c;
    	font-size: 1.25rem;
    	line-height: 1.25;
		font-weight: 700;
	}

	.notFoundText {
		text-align: center;
		margin-top: 20%;
		font-size: 1.25rem;
		line-height: 1.25;
		font-weight: 700;
	}
</style>