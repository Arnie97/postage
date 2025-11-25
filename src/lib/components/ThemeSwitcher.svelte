<script lang="ts">
  import { theme, setTheme, type Theme } from '../utils/theme';

  function toggleTheme() {
    const newTheme: Theme = $theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  }
</script>

<button class="theme-btn" on:click={toggleTheme} type="button" title="Toggle theme">
  {#if $theme === 'light'}
    ◐
  {:else}
    ◑
  {/if}
</button>

<style>
  .theme-btn {
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid var(--border-color);
    background: var(--bg-primary);
    color: var(--text-secondary);
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 40px;
    min-height: 40px;
  }

  .theme-btn:hover {
    background: var(--bg-tertiary);
  }

  .theme-btn:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgb(37 99 235 / 0.1);
  }
</style>
