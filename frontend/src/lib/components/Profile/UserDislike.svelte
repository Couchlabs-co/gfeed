<script lang="ts">
    import { Ban, Check } from 'lucide-svelte';
    import { userAction } from "../../userActions";
    export let interests: any[];
    export let userId: string;

</script>

<div>
    <div class="p-3 shadow-sm rounded-sm">
        <h2>Not Interested</h2>
        <table class="table">
            <thead>
                <tr>
                    <th class="text-lg text-black">Interests</th>
                    <th class="text-lg text-black">Interested/Not Interested</th>
                </tr>
                {#each interests as interest}
                <tr>
                    <td class="text-base text-black">
                        {interest.tagName}
                    </td>
                    <td class="flex flex-row">
                        <button class="btn m-2"  on:click={() =>
                            userAction(
                                userId,
                                interest.tagName,
                                "follows",
                                "interest",
                                "",
                                interest.interestId)}><Check /> Interested</button>
                        <button class="btn m-2" on:click={() =>
                            userAction(
                                userId,
                                interest.tagName,
                                "unfollow",
                                "interest",
                                "",
                                interest.interestId)}><Ban /> Not so much</button>
                    </td>
                </tr>
                {/each}
            </thead>
        </table>
    </div>
</div>