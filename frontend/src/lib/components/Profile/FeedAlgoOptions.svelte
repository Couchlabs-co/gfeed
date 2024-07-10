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
<div class="flex flex-row my-4 justify-center">
    <div class="flex-auto bg-slate-100 shadow rounded-lg p-4">
        <p class="m-2 text-left text-lg font-medium">Configure Feed</p>
        <div class="join">
            <button class={selectedAlgo === 'timeBased' ? 'btn btn-outline btn-block btn-active join-item' : 'btn btn-outline btn-block join-item'} on:click={handleChange} value='timeBased'>
                {#if selectedAlgo === 'timeBased'}
                    <Check />
                {/if}
                Show me everything
            </button>
            <button class={selectedAlgo === 'interestBased' ? 'btn btn-outline btn-block btn-active join-item' : 'btn btn-outline btn-block join-item'} on:click={handleChange} value='interestBased'>
                {#if selectedAlgo === 'interestBased'}
                    <Check />
                {/if}
                Based on my Interests
            </button>
        </div>
    </div>
</div>
<!-- <div class="bg-slate-100 shadow rounded-lg my-6 p-4 w-1/2">
    <p class="text-left text-lg font-medium">Configure Feed</p>
    <div class="w-auto">
        <div class="form-control">
            <label class="label cursor-pointer">
              <span class="label-text">Show me everything</span> 
              <input type="radio" bind:group={selectedAlgo} class={selectedAlgo === 'timeBased' ? 'radio checked:bg-green-500' : 'radio'} on:change={handleChange} value='timeBased'/>
            </label>
        </div>
        <div class="form-control">
            <label class="label cursor-pointer">
                <span class="label-text">Only my interests</span>
                <input type="radio" bind:group={selectedAlgo} class={selectedAlgo === 'interestBased' ? 'radio checked:bg-green-500' : 'radio'} checked on:change={handleChange} value='interestBased'/>
            </label>
        </div>
    </div>
</div> -->