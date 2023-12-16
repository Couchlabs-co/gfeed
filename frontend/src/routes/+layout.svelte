<script>
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>

<div class="container mx-auto w-5/6 min-h-screen">
	<Header />
	<div class="w-full m-2 h-5/6">
		<slot />
	</div>
	<Footer />
</div>
