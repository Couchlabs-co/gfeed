<script lang="ts">
	import Heading from '../../lib/components/Heading.svelte';
</script>
<div class="relative isolate overflow-hidden py-4 sm:py-4">
	<Heading heading={'Support'} />
	<div class="grid gap-6 auto-rows-fr grid-cols-4 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 mt-20">
		<div class="col-start-2 col-span-2 component component-CerCheckBox mx-auto">
			<div class="text-center border border-base-content card w-96 bg-base-100 shadow-xl m-4">
				<div class="card-body items-center text-center h-80">
					<h2 class="card-title justify-center">Support Package</h2>
					<p>Subscribe and help keep the lights on</p>
					<div>
						<span class="text-3xl">$</span>
						<span class="text-5xl font-bold">2</span>
						<span class="text-2xl text-gray-500">/mo</span>
					</div>
					<div class="card-actions justify-center">
						<button class="btn btn-primary">Subscribe</button>
					</div>
				</div>
			</div>
		</div>
	</div>

</div>
