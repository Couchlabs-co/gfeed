<script lang="ts">
    export let category = '';
</script>

{#if category}
    <div class="badge badge-primary">
        {category}
    </div>
{/if}