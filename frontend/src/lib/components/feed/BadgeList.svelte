<script lang="ts">
    export let keyword = '';
</script>

{#if keyword}
    <span class="badge badge-neutral badge-outline m-1">
        {keyword}
    </span>
{/if}