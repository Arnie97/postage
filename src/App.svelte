<script lang="ts">
  import './app.css';
  import LanguageSwitcher from './lib/components/LanguageSwitcher.svelte';
  import PostageCalculator from './lib/components/PostageCalculator.svelte';
  import { language } from './lib/utils/language';
  import { t } from './lib/data/translations';

  // PWA registration
  import { onMount } from 'svelte';

  onMount(async () => {
    if ('serviceWorker' in navigator) {
      try {
        const { Workbox } = await import('workbox-window');
        const wb = new Workbox('/sw.js');

        wb.addEventListener('controlling', () => {
          window.location.reload();
        });

        wb.register();
      } catch {
        console.log('SW registration failed');
      }
    }
  });
</script>

<main>
  <div class="container">
    <!-- Header -->
    <header class="header">
      <div>
        <h1 class="header-title">
          📮 {t('app.title', $language)}
        </h1>
      </div>
      <LanguageSwitcher />
    </header>

    <!-- Main Calculator -->
    <section class="section">
      <PostageCalculator />
    </section>

    <!-- Footer -->
    <footer class="footer">
      <p>
        Open source postage calculator for China Post, Chunghwa Post, Hongkong Post, and Macau Post
      </p>
      <p class="footer-paragraph">
        Licensed under GNU AGPL v3 •
        <a href="https://github.com" class="footer-link"> Source Code </a>
      </p>
    </footer>
  </div>
</main>

<style>
  main {
    min-height: 100vh;
    padding: 0;
  }

  @media (max-width: 640px) {
    header {
      flex-direction: column;
      gap: 1rem;
      align-items: flex-start !important;
    }
  }
</style>
