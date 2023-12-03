<script>
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>

<div class="container mx-auto w-9/12 h-4/5">
	<Header />
	<div class="w-full m-2 h-full">
		<slot />
	</div>
	<Footer />
</div>
