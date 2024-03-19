<script lang="ts">
    import { format } from 'date-fns';

    export let userPic: string;
    export let userName: string;
    export let memberSince: string;

    function formatDate(date: string) {
        return format(date, "dd MMM yyyy");
    }
</script>
<div class="container w-4/5 rounded-md">
    <!-- <div class="bg-white p-3 "> -->
        <div class="image overflow-hidden rounded-md">
            <img class="h-auto w-full mx-auto"
                src={userPic}
                alt={userName} />
        </div>
        <div>
            <!-- <h1 class="text-gray-900 font-bold text-xl leading-8 my-1">{userName}</h1> -->
        <ul
            class="bg-gray-100 text-gray-600 hover:text-gray-700 hover:shadow py-2 px-3 mt-3 divide-y rounded shadow-sm">
            <li class="flex items-center py-3">
                <span>Status</span>
                <span class="ml-auto"><span
                        class="bg-green-500 py-1 px-2 rounded text-white text-sm">Active</span></span>
            </li>
            <li class="flex items-center py-3">
                <span>Member since</span>
                <span class="ml-auto">{memberSince ? formatDate(memberSince) :  ''}</span>
            </li>
        </ul>
        </div>
        
    <!-- </div> -->
</div>