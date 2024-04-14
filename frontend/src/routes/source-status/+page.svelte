<script lang="ts">
    import Heading from '../../lib/components/Heading.svelte';
    import { toDate } from 'date-fns';

	export let data;

    const { Items } = data.data;

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
                    <tr class="{item.crawled === 'success' ? 'bg-green-200' : 'bg-red-200'}">
                    <th>{i+1}</th>
                    <td>{item.name}</td>
                    <td>{item.crawled}</td>
                    <td>{toDate(Date.parse(item.lastCrawled)).toLocaleString()}</td>
                    </tr>
                {/each}
              </tbody>
            </table>
          </div>
    </div>
</div>