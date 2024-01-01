<script lang="ts">
  import Heading from '../../lib/components/Heading.svelte';
</script>
<div class="relative isolate overflow-hidden py-4 sm:py-4">
  <Heading heading={'Features'} subHeading={'Discover and Read what you like'} />

    <div class="grid gap-6 auto-rows-fr grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 m-4">
      <div class="component component-CerCheckBox">
        <div class="bg-blue-light mb-4 h-100 shadow h-full">
          <div class="p-4">
            <div><strong class="text-blue-dark text-xl leading-normal mt-0 mb-2 hover:underline">Sources you like</strong></div>
            <p>Stay connected with publishers whose content resonates with you. Receive notifications or updates whenever these publishers release new content, ensuring you never miss out on their latest releases.</p>
          </div>
        </div>
      </div>
      <div class="component component-CerCheckBox">
        <div class="bg-blue-light mb-4 h-100 shadow h-full">
          <div class="p-4">
            <div><strong class="text-blue-dark text-xl leading-normal mt-0 mb-2 hover:underline">Follow topis you like</strong></div>
            <p>Tailor your browsing experience by selecting and subscribing to specific topics or categories that align with your personal preferences. Receive updates and curated content related to your chosen interests.</p>
          </div>
        </div>
      </div>

      <div class="component component-CerCheckBox">
        <div class="bg-blue-light mb-4 h-100 shadow h-full">
          <div class="p-4">
            <div><strong class="text-blue-dark text-xl leading-normal mt-0 mb-2 hover:underline">Your Interactions matter</strong></div>
            <p>Receive a customized experience based on your interactions. Your likes, dislikes, and engagements shape the content recommendations, ensuring that the platform serves you content that aligns with your preferences.</p>
          </div>
        </div>
      </div>

      <div class="component component-CerCheckBox">
        <div class="bg-blue-light mb-4 h-100 shadow h-full">
          <div class="p-4">
            <div><strong class="text-blue-dark text-xl leading-normal mt-0 mb-2 hover:underline">Serendipity</strong></div>
            <p>Explore diverse and unexpected content recommendations outside your usual interests. Uncover fresh perspectives, articles, or creators through algorithms or features designed to introduce you to content beyond your subscribed topics or publishers.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <div class="mx-auto max-w-7xl px-6 lg:px-8 my-6">
    <div class="mx-auto max-w-2xl lg:mx-0">
      <h4 class="text-sm font-bold tracking-tight sm:text-2xl">Roadmap</h4>
    </div>
    <div>
      <table class="table-sm">
        <tr>
          <th>1</th>
          <td>Mobile app (IOS and Android) to use GFeed on the go</td>
          <td></td>
        </tr>
        <tr>
          <th>2</th>
          <td>On Demand delete your complete data stored in our system</td>
          <td></td>
        </tr>
        <tr>
          <th>3</th>
          <td>Ability to follow creators of the articles</td>
        </tr>
        <tr>
          <th>4</th>
          <td>Ability to read articles behind paywall</td>
        </tr>
        <tr>
          <th>5</th>
          <td>AI based feed algorithm</td>
        </tr>
        <tr>
          <th>6</th>
          <td>Contextual Search</td>
        </tr>
      </table>
    </div>
</div>