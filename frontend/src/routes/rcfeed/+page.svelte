<script lang="ts">
	import ListItem from '$lib/components/feed/ListItem.svelte';

	/** @type {import('./$types').PageData} */
	export let data;
	const { Count, Items } = data;

</script>

<div class="w-full rounded p-2">
	{#if Count === 0}
		<p class="text-center">No articles found.</p>
	{:else}
		{#each Items as Item}
			<ListItem Item ={Item} />
		{/each}
	{/if}
</div>