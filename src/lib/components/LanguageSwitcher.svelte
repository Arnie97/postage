<script lang="ts">
  import { language, setLanguage, type Language } from '../utils/language';

  const LANGUAGES: { code: Language; name: string }[] = [
    { code: 'zh-TW', name: '繁' },
    { code: 'zh-CN', name: '简' },
    { code: 'en', name: 'EN' },
  ];

  function handleLanguageChange(lang: Language) {
    setLanguage(lang);
  }
</script>

<div class="language-switcher">
  {#each LANGUAGES as lang}
    <button
      class="lang-btn"
      class:active={$language === lang.code}
      on:click={() => handleLanguageChange(lang.code)}
      type="button"
    >
      {lang.name}
    </button>
  {/each}
</div>
