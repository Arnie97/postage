<script lang="ts">
  import './app.css';
  import LanguageSwitcher from './lib/components/LanguageSwitcher.svelte';
  import ThemeSwitcher from './lib/components/ThemeSwitcher.svelte';
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
      <div class="header-controls">
        <LanguageSwitcher />
        <ThemeSwitcher />
      </div>
    </header>

    <!-- Main Calculator -->
    <section class="section">
      <PostageCalculator />
    </section>

    <!-- Footer -->
    <footer class="footer">
      <p>
        {t('footer.description', $language)}
      </p>
      <p class="footer-paragraph">
        <a href="https://github.com/arnie97/postage" class="footer-link">
          {t('footer.source-code', $language)}</a
        >{t('footer.license', $language)}
      </p>
    </footer>
  </div>
</main>

<style>
  main {
    min-height: 100vh;
    padding: 0;
  }

  @media (max-width: 480px) {
    .header {
      flex-direction: column;
      gap: 1rem;
      align-items: flex-start !important;
    }

    .header-controls {
      align-self: stretch;
      justify-content: space-between;
    }
  }
</style>
