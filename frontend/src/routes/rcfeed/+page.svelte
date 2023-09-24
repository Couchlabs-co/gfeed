<script lang="ts">
	import ListItem from '$lib/components/feed/ListItem.svelte';

	/** @type {import('./$types').PageData} */
	export let data;
	const { res, session } = data;
	const { Count, Items } = res;

	const user_id = session.user?.id.split('|')[1];

</script>

<div class="w-full rounded p-2">
	{#if Count === 0}
		<p class="text-center">No articles found.</p>
	{:else}
		{#each Items as Item}
			<ListItem Item ={Item} userId={user_id}/>
		{/each}
	{/if}
</div>