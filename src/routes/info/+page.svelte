<script>
  import Header from '$lib/components/Header.svelte';
</script>

<svelte:head>
  <title>Info - Christopher Mably</title>
</svelte:head>

	<Header />

<main>
  <div class="info-container">
    <div class="profile-image">
      <!-- Placeholder image - will use a grey circle with initials -->
      <div class="image-placeholder">CM</div>
    </div>
    
    <h1 class="name">Christopher Mably</h1>
    <p class="role">Director / Cinematographer</p>
    
    <p class="bio">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
      With over a decade of experience crafting visual narratives, 
      I specialize in creating compelling stories that resonate with 
      audiences across commercial, documentary, and narrative formats.
    </p>
    
    <a href="mailto:hello@christophermably.com" class="email">
      hello@christophermably.com
    </a>
  </div>
</main>

<style>
  main {
    min-height: 100vh;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 120px 20px 40px;
  }

  .info-container {
    max-width: 600px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .profile-image {
    margin-bottom: 40px;
  }

  .image-placeholder {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: #e0e0e0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    font-weight: 600;
    color: #666;
  }

  .name {
    font-size: 32px;
    font-weight: 600;
    margin: 0 0 10px 0;
    color: #000;
    font-family: system-ui, -apple-system, sans-serif;
  }

  .role {
    font-size: 14px;
    font-weight: 500;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin: 0 0 40px 0;
    font-family: system-ui, -apple-system, sans-serif;
  }

  .bio {
    font-size: 16px;
    line-height: 1.6;
    color: #333;
    max-width: 500px;
    margin: 0 0 40px 0;
    font-family: system-ui, -apple-system, sans-serif;
  }

  .email {
    font-size: 16px;
    color: #000;
    text-decoration: none;
    border-bottom: 1px solid #000;
    transition: opacity 0.3s ease;
    font-family: system-ui, -apple-system, sans-serif;
  }

  .email:hover {
    opacity: 0.7;
  }

  /* Mobile responsive */
  @media (max-width: 768px) {
    main {
      padding: 100px 20px 30px;
    }
    
    .profile-image {
      margin-bottom: 30px;
    }
    
    .image-placeholder {
      width: 100px;
      height: 100px;
      font-size: 28px;
    }
    
    .name {
      font-size: 28px;
    }
    
    .role {
      font-size: 12px;
      margin-bottom: 30px;
    }
    
    .bio {
      font-size: 15px;
      margin-bottom: 30px;
    }
    
    .email {
      font-size: 15px;
    }
  }
</style>
