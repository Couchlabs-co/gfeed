<script lang="ts">
    export let keyword: string; 
</script>

{#if keyword}
    <div class="badge badge-primary m-1 p-3">
        {keyword}
    </div>
{/if}