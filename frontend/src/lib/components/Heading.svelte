<script lang="ts">
    export let heading: string | undefined = undefined;
    export let subHeading: string = '';
</script>
<div class="max-w-7xl px-6 lg:px-8 my-4">
    <div class="mx-auto max-w-2xl lg:mx-0">
        <h2 class="text-3xl font-bold tracking-tight sm:text-3xl" data-testid="heading">{heading}</h2>
        {#if subHeading || subHeading !== ''}
            <p class="mt-6 text-lg leading-8 text-gray-500" data-testid="subHeading">{subHeading}</p>
        {/if}
    </div>
</div>