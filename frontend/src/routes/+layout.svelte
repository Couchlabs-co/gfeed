<script>
	import '../app.css';
	import Header from '../lib/components/Header.svelte';
	import Footer from '../lib/components/Footer.svelte';
</script>

<div class="container mx-auto w-5/6">
	<Header />
	<div class="m-2">
		<slot />
	</div>
	<Footer />
</div>
