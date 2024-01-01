<script lang="ts">
    import Heading from '../../lib/components/Heading.svelte';
    import { Toaster, toast } from 'svelte-french-toast';

	export let data;

    /** @type {import('./$types').ActionData} */
    export let form;
    
    const { Items } = data.data;

    if (form?.msg === "Success") {
        toast.success("Source added successfully");
    } else if(form !== null){
        toast.error("Error adding source");
    }

</script>
<div class="relative isolate overflow-hidden py-4 sm:py-4">
    <Heading heading={'All Sources'} subHeading={'Some of the sources we pull data from to make sure you have latest content'} />

    <div class="flex flex-row">
        <div class="flex flex-col w-8/12">
            <div class="grid grid-cols-3 gap-4">
                {#each Items as Item}
                <div class="max-w-sm rounded-lg overflow-hidden shadow-lg m-2 bg-slate-100">
                    <div class="px-6 py-4">
                    <div class="h-auto font-bold text-s mb-2">
                        <p class="text-ellipsis">
                            {Item}
                        </p>
                    </div>
                    </div>
                </div>
                {/each}

            </div>
        </div>

        <div class="sidePanel">
            <Toaster />
            <div class="mx-auto px-6 lg:px-8 my-6">
                <div class="mx-auto lg:mx-0">
                <h4 class="text-sm font-bold tracking-tight sm:text-2xl">Suggest a source</h4>
                </div>
                <div>
                <form class="w-full" method="POST" action="?/addSource">
                    <div class="flex flex-wrap -mx-3 mb-6">
                    <div class="w-full px-3">
                        <label class="block tracking-wide text-gray-700 text-xs font-bold mb-2" for="source-name">
                        Source Name
                        </label>
                        <input type="text" placeholder="e.g. hacker news" class="input input-bordered w-full max-w-xs" name="source-name"/>
                    </div>
                    </div>
                    <div class="flex flex-wrap -mx-3 mb-6">
                    <div class="w-full px-3">
                        <label class="block tracking-wide text-gray-700 text-xs font-bold mb-2" for="source-url">
                        Source URL
                        </label>
                        <input type="text" placeholder="e.g. https://news.ycombinator.com" class="input input-bordered w-full max-w-xs" name="source-url"/>
                    </div>
                    </div>
                    <div class="flex flex-wrap -mx-3 mb-2">
                    <div class="w-full px-3">
                        <button class="btn btn-neutral btn-wide" type="submit">
                            Submit
                        </button>
                    </div>
                    </div>
                </form>
                </div>
            </div>
        </div>
    </div>
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
</style>