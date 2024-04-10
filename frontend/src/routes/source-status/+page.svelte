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
    <Heading heading={'Sources'} subHeading={'Status as per last pull'} />

    <div class="flex flex-row">
        <div class="overflow-x-auto">
            <table class="table">
              <!-- head -->
              <thead>
                <tr>
                  <th></th>
                  <th>Source Name</th>
                  <th>Crawled Status</th>
                  <th>Last Crawled Time</th>
                </tr>
              </thead>
              <tbody>
                <!-- row 1 -->
                {#each Items as item, i}
                    <tr>
                    <th>{i}</th>
                    <td>{item.name}</td>
                    <td>{item.crawled}</td>
                    <td>{item.lastCrawled}</td>
                    </tr>
                {/each}
              </tbody>
            </table>
          </div>
    </div>
</div>