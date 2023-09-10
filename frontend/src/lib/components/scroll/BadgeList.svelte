<script lang="ts">
    export let category = '';
</script>

{#if category}
    <span class="badge badge-neutral badge-outline m-1">
        {category}
    </span>
{/if}