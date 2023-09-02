<script lang="ts">
	import ListItem from '$lib/components/scroll/ListItem.svelte';

	/** @type {import('./$types').PageData} */
	export let data;
	const { Count, Items } = data;

</script>

<div class="w-full rounded p-2">
	{#each Items as Item}
		<ListItem Item ={Item} />
	{/each}
</div>