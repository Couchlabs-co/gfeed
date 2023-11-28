<script lang="ts">
    import { userAction } from '$lib/userActions.js';
    export let interests: any[];
    export let interestsUserFollow: any[];
    export let userId: string;
    let checked = false;

    async function handleClick(e: any) {
     const interest = JSON.parse(e.target.value);
     if(e.target.checked) {
         const response = await userAction(userId, interest.tagName, "follow", "interest", "", interest.interestId);
         if(response.msg === 'Success') {
             e.target.checked = true;
         }
     } else {
         userAction(userId, interest.tagName, "unfollow", "interest", "", interest.interestId);
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

<div class="w-4/5">
    <div class="p-3 shadow-sm rounded-sm">
        <h2>What interests you?</h2>
        <table class="table-sm m-auto w-4/5">
            <thead>
                <tr class="bg-slate-100">
                    <th class="text-lg text-black text-left">Interests</th>
                    <th class="text-lg text-black text-left">Interested/Not Interested</th>
                </tr>
                {#each interests as interest}
                {checked = interestsUserFollow.find((item) => item.content === interest.tagName) ? true : false}
                    
                <tr>
                    <td class="text-base text-black">
                        {interest.tagName}
                    </td>
                    <td class="flex flex-row">
                        <input type="checkbox" class="toggle toggle-success" checked={interestToggle(interest.tagName)} on:click|preventDefault={handleClick} value={JSON.stringify(interest)} id={interest.interestId}/>
                    </td>
                </tr>
                {/each}
            </thead>
        </table>
    </div>
</div>