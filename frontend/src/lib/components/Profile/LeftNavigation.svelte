<script lang="ts">
    export let handleChange: (item: string) => void;
</script>
<div class="container w-4/5 rounded-md mt-4">
    <div class="flex-row-reverse w-auto bg-gray-100 rounded-box">
        <button class="btn btn-link bg-gray-100 text-black no-underline" on:click={() => handleChange('Interests')}>
            <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    My Interests
        </button>
        <button class="btn btn-link bg-gray-100 text-black no-underline" on:click={() => handleChange('ReadLater')}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Read later...
            </button>
        <button class="btn btn-link bg-gray-100 text-black no-underline" on:click={() => handleChange('LikeThese')}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            I like these...
            </button>
    </div>
        <!-- <ul class="bg-gray-100 text-gray-600 hover:text-gray-700 hover:shadow mt-auto divide-y rounded shadow-sm justify-center">
            <li class="py-3 justify-center">
                <span>Status</span>
                <span class="bg-green-500 py-1 px-2 rounded text-white text-sm">Active</span>
                <button class="btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-monitor-check"><path d="m9 10 2 2 4-4"/><rect width="20" height="14" x="2" y="3" rx="2"/><path d="M12 17v4"/><path d="M8 21h8"/></svg>
                    Active</button>
            </li> -->
            <!-- <li class="flex items-center py-3">
                <span>Member since</span>
                <span class="ml-auto">{memberSince ? formatDate(memberSince) :  ''}</span>
            </li> -->
        <!-- </ul> -->
</div>