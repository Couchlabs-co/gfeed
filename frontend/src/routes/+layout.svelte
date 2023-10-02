<script>
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>

<div class="container mx-auto w-9/12">
	<Header />
	<div class="flex flex-col w-full m-0">
		<slot />
	</div>
	<Footer />
</div>
