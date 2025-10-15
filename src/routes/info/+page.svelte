<script>
  import Header from '$lib/components/Header.svelte';
</script>

<svelte:head>
  <title>Info - Christopher Mably</title>
</svelte:head>

<Header showToggle={true} />

<main>
  <div class="info-container">
    <h1>Info</h1>
    <p>Coming soon...</p>
  </div>
</main>

<style>
  main {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .info-container {
    text-align: center;
  }
</style>
