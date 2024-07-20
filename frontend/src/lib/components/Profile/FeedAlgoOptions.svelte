<script lang="ts">
	import { userAction } from "../../userActions";
    import { createEventDispatcher } from 'svelte';
    import { Check } from 'lucide-svelte';

    const dispatch = createEventDispatcher();
    export let selectedAlgo: 'timeBased' | 'interestBased' = 'timeBased';
    export let userId: string;

    async function handleChange(e: any) {
     if(userId){
        const response = await userAction(userId, e.target.value, "selected", "feedAlgo", "", "");
        if(response.msg === 'Success'){
            dispatch('feedAlgoChanged', {
                selectedAlgo: e.target.value
            });
        }
        selectedAlgo = response.msg === 'Success' ? e.target.value : selectedAlgo;
     }
    }

</script>
<div class="flex my-4 justify-center">
    <div class="flex-auto bg-slate-100 shadow rounded-lg p-4">
        <p class="m-2 text-left text-lg font-medium">Configure Feed</p>

        <div class="inline-flex rounded-md" role="group">
            <button type="button" on:click={handleChange} value='timeBased' class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-transparent border border-gray-400 rounded-s-lg hover:bg-gray-900 hover:text-white dark:border-gray-800 focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:hover:text-white dark:focus:bg-gray-700 {selectedAlgo === 'timeBased' ? 'bg-gray-900 text-white dark:bg-gray-900 dark:text-white dark:hover:bg-gray-700': 'dark:text-black dark:hover:bg-gray-700'}">
                {#if selectedAlgo === 'timeBased'}
                    <Check class="m-2"/>
                {/if}
                Show me Everything...
            </button>
            <button type="button" on:click={handleChange} value='interestBased' class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-transparent border border-black rounded-e-lg hover:bg-gray-900 hover:text-white  dark:border-gray-800 focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:hover:text-white dark:focus:bg-gray-700 {selectedAlgo === 'interestBased' ? 'bg-gray-900 text-white dark:bg-gray-900 dark:text-white dark:hover:bg-gray-700': 'dark:text-black dark:hover:bg-gray-700'}">
                {#if selectedAlgo === 'interestBased'}
                    <Check class="m-2" />
                {/if}
                Based on my Interests
            </button>
        </div>
    </div>
</div>
