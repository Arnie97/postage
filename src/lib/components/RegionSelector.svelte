<script lang="ts">
  import { language } from '../utils/language';
  import { t } from '../data/translations';
  import {
    MAINLAND_PROVINCES,
    SPECIAL_REGIONS,
    INTERNATIONAL_REGIONS,
    type Region,
  } from '../data/regions';
  import type { Language } from '../utils/language';

  export let selectedRegion: string = '';
  export let label: string = '';
  export let isDestination: boolean = false;

  $: currentLang = $language;

  // 根据是否为目的地来决定显示哪些地区
  $: availableRegions = getAvailableRegions(isDestination);

  function getAvailableRegions(isDestination: boolean): Region[] {
    if (isDestination) {
      // 目的地包含所有地区（港澳台、大陆、国际）
      return [...SPECIAL_REGIONS, ...MAINLAND_PROVINCES, ...INTERNATIONAL_REGIONS];
    } else {
      // 出发地只包含港澳台和大陆
      return [...SPECIAL_REGIONS, ...MAINLAND_PROVINCES];
    }
  }

  function getRegionName(region: Region, lang: Language): string {
    const name = region.name[lang] || region.name.en;
    // Add country code before name, separated by dash
    // For mainland provinces, remove CN- prefix and use just the province code
    // For international regions, use the country code
    // For special regions (HK, MO, TW), use the region code
    const displayCode = region.code.startsWith('CN-') ? region.code.substring(3) : region.code;
    return `${displayCode} - ${name}`;
  }

  function groupRegions(regions: Region[]) {
    const groups = {
      mainland: regions.filter((r) => r.code.startsWith('CN-')),
      special: regions.filter((r) => ['TW', 'HK', 'MO'].includes(r.code)),
      asia: regions.filter((r) => r.continent === 'AS'),
      europe: regions.filter((r) => r.continent === 'EU'),
      northamerica: regions.filter((r) => r.continent === 'NA'),
      oceania: regions.filter((r) => r.continent === 'OC'),
      africa: regions.filter((r) => r.continent === 'AF'),
      southamerica: regions.filter((r) => r.continent === 'SA'),
      other: regions.filter((r) => r.continent === 'AN'),
    };
    return groups;
  }

  $: regionGroups = groupRegions(availableRegions);
</script>

<div class="form-group">
  <label class="form-label" for={label}>
    {label}
  </label>

  <select id={label} class="form-control select" bind:value={selectedRegion} required>
    <option value="" disabled>
      {t('region.select', currentLang)}
    </option>

    <!-- 港澳台地区 -->
    {#if regionGroups.special.length > 0}
      <optgroup label={t('region.special', currentLang)}>
        {#each regionGroups.special as region}
          <option value={region.code}>
            {getRegionName(region, currentLang)}
          </option>
        {/each}
      </optgroup>
    {/if}

    <!-- 大陆地区 -->
    {#if regionGroups.mainland.length > 0}
      <optgroup label={t('region.mainland', currentLang)}>
        {#each regionGroups.mainland as region}
          <option value={region.code}>
            {getRegionName(region, currentLang)}
          </option>
        {/each}
      </optgroup>
    {/if}

    <!-- 亚洲（仅目的地） -->
    {#if isDestination && regionGroups.asia.length > 0}
      <optgroup label={t('continent.AS', currentLang)}>
        {#each regionGroups.asia as region}
          <option value={region.code}>
            {getRegionName(region, currentLang)}
          </option>
        {/each}
      </optgroup>
    {/if}

    <!-- 欧洲（仅目的地） -->
    {#if isDestination && regionGroups.europe.length > 0}
      <optgroup label={t('continent.EU', currentLang)}>
        {#each regionGroups.europe as region}
          <option value={region.code}>
            {getRegionName(region, currentLang)}
          </option>
        {/each}
      </optgroup>
    {/if}

    <!-- 非洲（仅目的地） -->
    {#if isDestination && regionGroups.africa.length > 0}
      <optgroup label={t('continent.AF', currentLang)}>
        {#each regionGroups.africa as region}
          <option value={region.code}>
            {getRegionName(region, currentLang)}
          </option>
        {/each}
      </optgroup>
    {/if}

    <!-- 北美洲（仅目的地） -->
    {#if isDestination && regionGroups.northamerica.length > 0}
      <optgroup label={t('continent.NA', currentLang)}>
        {#each regionGroups.northamerica as region}
          <option value={region.code}>
            {getRegionName(region, currentLang)}
          </option>
        {/each}
      </optgroup>
    {/if}

    <!-- 南美洲（仅目的地） -->
    {#if isDestination && regionGroups.southamerica.length > 0}
      <optgroup label={t('continent.SA', currentLang)}>
        {#each regionGroups.southamerica as region}
          <option value={region.code}>
            {getRegionName(region, currentLang)}
          </option>
        {/each}
      </optgroup>
    {/if}

    <!-- 大洋洲（仅目的地） -->
    {#if isDestination && regionGroups.oceania.length > 0}
      <optgroup label={t('continent.OC', currentLang)}>
        {#each regionGroups.oceania as region}
          <option value={region.code}>
            {getRegionName(region, currentLang)}
          </option>
        {/each}
      </optgroup>
    {/if}

    <!-- 其他（仅目的地） -->
    {#if isDestination && regionGroups.other.length > 0}
      <optgroup label={t('continent.AN', currentLang)}>
        {#each regionGroups.other as region}
          <option value={region.code}>
            {getRegionName(region, currentLang)}
          </option>
        {/each}
      </optgroup>
    {/if}
  </select>
</div>

<style>
  optgroup {
    font-weight: 600;
    color: var(--text-primary);
  }

  option {
    font-weight: 400;
    padding: 0.5rem;
  }
</style>
