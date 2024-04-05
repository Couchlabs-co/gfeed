<script lang="ts">
    import { userAction } from "../../userActions";
    export let interests: any[];
    export let interestsUserFollow: any[];
    export let userId: string;
    let checked = false;

    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    async function handleClick(e: any) {
     const interest = JSON.parse(e.target.value);
     if(e.target.checked) {
         const response = await userAction(userId, interest.tagName, "follow", "interest", "", interest.interestId);
         if(response.msg === 'Success') {
             dispatch('userInterestEvent', {
                userInterest: e.target.value,
                action: 'follow'
            });
             e.target.checked = true;
         }
     } else {
        const response = await userAction(userId, interest.tagName, "unfollow", "interest", "", interest.interestId);
         if(response.msg === 'Success') {
            dispatch('userInterestEvent', {
               userInterest: e.target.value,
               action: 'unfollow'
           });
             e.target.checked = false;
         }
     }
    }

    function interestToggle(interest: string) {
        if(interestsUserFollow.find((item) => item.content === interest)) {
            return true;
        } else if(checked){
            return true;
        } else {
            return false;
        }
    }


</script>

<div class="w-auto justify-left">
    <div class="p-3 shadow-sm rounded-sm">
        <h2 class="text-md">Personalize your feed by selecting what you are interested in</h2>
        <div class="mt-4 justify-left">
            <table class="table-sm w-2/3">
                <thead>
                    <tr class="bg-slate-100">
                        <th colspan="2" class="text-lg text-black text-left">Interests</th>
                        <!-- <th class="text-lg text-black text-left">Interested/Not Interested</th> -->
                    </tr>
                    {#each interests as interest}
                    <tr>
                        <td class="text-base text-black">
                            {interest.tagName}
                        </td>
                        <td class="flex flex-row">
                            <input type="checkbox" class="toggle toggle-success"
                                checked={interestToggle(interest.tagName)} 
                                value={JSON.stringify(interest)} id={interest.interestId}
                                on:click|preventDefault={handleClick}
                            />
                        </td>
                    </tr>
                    {/each}
                </thead>
            </table>
        </div>
    </div>
</div>