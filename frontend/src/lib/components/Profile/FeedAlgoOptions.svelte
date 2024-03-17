<script lang="ts">
	import { userAction } from "../../userActions";
    import { page } from "$app/stores";
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();
    export let selectedAlgo: 'timeBased' | 'interestBased' = 'timeBased';

    const { user } = $page.data.session || {};

    async function handleChange(e: any) {
     if(user.id){
        const response = await userAction(user.id, "feedAlgo", "selected", e.target.value, "", "");
        if(response.msg === 'Success'){
            dispatch('feedAlgoChanged', {
                selectedAlgo: e.target.value
            });
        }
        selectedAlgo = response.msg === 'Success' ? e.target.value : selectedAlgo;
     }
    }

</script>
<div class="bg-slate-100 shadow rounded-lg my-6 p-4 w-1/2">
    <p class="text-left text-lg font-medium">Configure Feed</p>
    <div class="w-auto">
        <div class="form-control">
            <!-- <label class="label cursor-pointer">
                <span class="label-text">Latest first - older last</span> 
                <input type="checkbox" id='timeBased' bind:checked={checked} class="checkbox" on:click|preventDefault={handleChange}/>
            </label> -->
            <label class="label cursor-pointer">
              <span class="label-text">Show me everything</span> 
              <input type="radio" bind:group={selectedAlgo} class={selectedAlgo === 'timeBased' ? 'radio checked:bg-green-500' : 'radio'} on:change={handleChange} value='timeBased'/>
            </label>
        </div>
        <div class="form-control">
            <!-- <label class="label cursor-pointer">
                <span class="label-text">Based on my interests</span> 
                <input type="checkbox" id='interestBased' checked={checked} class="checkbox" on:click|preventDefault={handleChange}/>
            </label> -->
            <label class="label cursor-pointer">
                <span class="label-text">Only my interests</span>
                <input type="radio" bind:group={selectedAlgo} class={selectedAlgo === 'interestBased' ? 'radio checked:bg-green-500' : 'radio'} checked on:change={handleChange} value='interestBased'/>
            </label>
        </div>
    </div>
</div>