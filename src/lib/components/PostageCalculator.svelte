<script lang="ts">
  import { language } from '../utils/language';
  import { t, type TranslationKey } from '../data/translations';
  import {
    calculatePostageRate,
    type MailType,
    type PostageResult,
    type MailCategory,
  } from '../utils/postal-rates';
  import { RATE_RULES } from '../data/rates';
  import { getRegionType, getChinaPostInternationalZone, POSTAL_ZONES } from '../data/regions';
  import RegionSelector from './RegionSelector.svelte';

  let selectedMailType: MailType = 'letter';
  let selectedMailCategory: MailCategory | null = null;
  let originRegion = 'CN-BJ';
  let destinationRegion = 'HK';
  let weight = '20';
  let result: PostageResult | null = null;
  let error = '';
  let previousMailType: MailType = 'letter';

  $: currentLang = $language;

  // Get available mail types based on origin and destination
  $: availableMailTypes = getAvailableMailTypes(originRegion, destinationRegion);

  // Reset mail type if not available
  $: {
    if (availableMailTypes.length > 0 && !availableMailTypes.includes(selectedMailType)) {
      selectedMailType = availableMailTypes[0];
    }
  }

  // Check if destination is international (show delivery method options)
  $: isInternationalDestination = destinationRegion && getRegionType(destinationRegion) === 'XX';

  // Get available mail categories for the destination
  $: availableMailCategories = getAvailableMailCategories(originRegion, destinationRegion);

  // Set default mail category when destination changes or category becomes unavailable
  $: {
    if (!isInternationalDestination) {
      selectedMailCategory = null;
    } else if (!availableMailCategories.includes(selectedMailCategory as MailCategory)) {
      // Set SAL as default if available, otherwise the first available method (usually air)
      if (availableMailCategories.includes('sal')) {
        selectedMailCategory = 'sal';
      } else if (availableMailCategories.length > 0) {
        selectedMailCategory = availableMailCategories[0];
      } else {
        selectedMailCategory = null;
      }
    }
  }

  // Set default weight based on mail type only when mail type changes
  $: {
    if (selectedMailType !== previousMailType) {
      if (selectedMailType === 'postcard' || selectedMailType === 'letter') {
        weight = '20';
      } else if (selectedMailType === 'printed_papers') {
        weight = '50';
      } else if (
        selectedMailType === 'parcel' ||
        selectedMailType === 'ems' ||
        selectedMailType === 'small_packet'
      ) {
        weight = '100';
      }
      previousMailType = selectedMailType;
    }
  }

  function getAvailableMailCategories(origin: string, destination: string): MailCategory[] {
    if (!origin || !destination) return [];

    const originType = getRegionType(origin);
    const destType = getRegionType(destination);

    // Only show mail categories for China Post international mail
    if (originType !== 'CN' || destType !== 'XX') {
      return [];
    }

    const chinaPostZone = getChinaPostInternationalZone(destination);
    if (!chinaPostZone) return [];

    const categories: MailCategory[] = [];
    if (chinaPostZone.air !== undefined) categories.push('air');
    if (chinaPostZone.sal !== undefined) categories.push('sal');
    if (chinaPostZone.surface !== undefined) categories.push('surface');

    return categories;
  }

  // Auto-calculate when inputs change
  $: {
    // Include selectedMailCategory in dependencies to trigger recalculation
    selectedMailCategory;
    if (originRegion && destinationRegion && weight && selectedMailType) {
      calculate();
    } else {
      result = null;
      error = '';
    }
  }

  function getAvailableMailTypes(origin: string, destination: string): MailType[] {
    return [
      'letter',
      'postcard',
      'printed_papers',
      'items_for_blind',
      'small_packet',
      'm_bags',
      'parcel',
      'ems',
    ];
  }

  function getMailTypeKey(mailType: string): TranslationKey {
    return `mail.type.${mailType}` as TranslationKey;
  }

  // Unified service configuration
  const SERVICE_CONFIG = {
    services: {
      'China Post': {
        translationKey: 'service.china-post' as TranslationKey,
        primaryColor: '#059669', // Forest Green (from logo)
        secondaryColor: '#f59e0b', // Golden Yellow (from logo)
      },
      'Chunghwa Post': {
        translationKey: 'service.chunghwa-post' as TranslationKey,
        primaryColor: '#dd2222',
        secondaryColor: '#2147a5',
      },
      'Hong Kong Post': {
        translationKey: 'service.hongkong-post' as TranslationKey,
        primaryColor: '#16875a',
        secondaryColor: '#323092',
      },
      'Macau Post': {
        translationKey: 'service.macau-post' as TranslationKey,
        primaryColor: '#0071ba',
        secondaryColor: '#cf202e',
      },
    },
  };

  function getCurrencyKey(currency: string): TranslationKey {
    return `currency.${currency.toLowerCase()}` as TranslationKey;
  }

  function getServiceKey(service: string): TranslationKey {
    return (
      SERVICE_CONFIG.services[service as keyof typeof SERVICE_CONFIG.services]?.translationKey ||
      'service.auto'
    );
  }

  function getServicePrimaryColor(service: string): string {
    return SERVICE_CONFIG.services[service as keyof typeof SERVICE_CONFIG.services]?.primaryColor;
  }

  function getServiceSecondaryColor(service: string): string {
    return SERVICE_CONFIG.services[service as keyof typeof SERVICE_CONFIG.services]?.secondaryColor;
  }

  function getZoneDescription(zone: string): string {
    // Format: "international_sal_letter_1", "international_air_other_2", etc.
    const [prefix, mailCategory, mailType, zoneNumber] = zone.split('_');
    const zoneKey = {
      international: `${prefix}_${mailCategory}`,
      domestic: `${prefix}_${mailType}`,
    }[prefix] as keyof typeof POSTAL_ZONES;

    let zones = POSTAL_ZONES[zoneKey];
    if (typeof zones !== 'object') {
      return '';
    }
    zones = zones[mailType as keyof typeof zones] || zones;
    return zones[parseInt(zoneNumber) as keyof typeof zones] || '';
  }

  function calculate() {
    error = '';
    result = null;

    const weightNum = parseFloat(weight);
    if (!weight || isNaN(weightNum) || weightNum <= 0) {
      error = t('error.weight', currentLang);
      return;
    }

    if (!originRegion || !destinationRegion) {
      error = t('error.calculation', currentLang);
      return;
    }

    const calculatedResult = calculatePostageRate(
      selectedMailType,
      originRegion,
      destinationRegion,
      weightNum,
      selectedMailCategory || undefined,
    );

    if (!calculatedResult) {
      error = t('error.calculation', currentLang);
      return;
    }

    result = calculatedResult;
  }
</script>

<div class="card">
  <div class="card-content">
    <!-- Region Selection Row -->
    <div class="region-row">
      <div class="region-col">
        <RegionSelector
          bind:selectedRegion={originRegion}
          label={t('sender', currentLang)}
          isDestination={false}
        />
      </div>
      <div class="region-col">
        <RegionSelector
          bind:selectedRegion={destinationRegion}
          label={t('receiver', currentLang)}
          isDestination={true}
        />
      </div>
    </div>

    <!-- Mail Type Selection -->
    <div class="form-group">
      <fieldset class="fieldset-reset">
        <legend class="form-label">
          {t('mail.type', currentLang)}
        </legend>
        <div class="radio-group">
          {#each availableMailTypes as mailType}
            <label class="radio-item">
              <input type="radio" bind:group={selectedMailType} value={mailType} name="mailType" />
              <span>{t(getMailTypeKey(mailType), currentLang)}</span>
            </label>
          {/each}
        </div>
      </fieldset>
    </div>

    <!-- Mail Category Selection (International Only) -->
    {#if isInternationalDestination && availableMailCategories.length > 0}
      <div class="form-group">
        <fieldset class="fieldset-reset">
          <legend class="form-label">
            {t('mail.category', currentLang)}
          </legend>
          <div class="radio-group">
            {#each availableMailCategories as category}
              <label class="radio-item">
                <input
                  type="radio"
                  bind:group={selectedMailCategory}
                  value={category}
                  name="mailCategory"
                />
                <span>{t(`mail.category.${category}`, currentLang)}</span>
              </label>
            {/each}
          </div>
        </fieldset>
      </div>
    {/if}

    <!-- Weight Input -->
    <div class="form-group">
      <label class="form-label" for="weight">
        {t('weight', currentLang)} ({t('weight.grams', currentLang)})
      </label>
      <input
        id="weight"
        type="number"
        class="form-control"
        bind:value={weight}
        min="1"
        step="1"
        required
      />
      {#if error}
        <div class="error-message">{error}</div>
      {/if}
    </div>

    <!-- Result Display -->
    {#if result}
      <div
        class="result-card"
        style="background: linear-gradient(135deg, {getServicePrimaryColor(
          result.service,
        )}, {getServiceSecondaryColor(result.service)});"
      >
        <div class="result-price">
          {result.price.toFixed(2)}
          {t(getCurrencyKey(result.currency), currentLang)}
        </div>
        <div class="result-details">
          {t(getServiceKey(result.service), currentLang)} •
          {t(getMailTypeKey(result.mailType), currentLang)}
          {#if result.mailCategory}
            • {t(`mail.category.${result.mailCategory}`, currentLang)}
          {/if}
          {#if result.zoneId}
            • {getZoneDescription(result.zoneId)}
          {/if}
          {#if result.ruleId && RATE_RULES[result.ruleId]}
            • <a
              href={RATE_RULES[result.ruleId].url}
              target="_blank"
              rel="noopener noreferrer"
              class="rate-rule-link"
            >
              {RATE_RULES[result.ruleId].name}
            </a>
          {/if}
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .region-row {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .region-col {
    flex: 1;
  }

  .rate-rule-link {
    color: white;
    font-size: inherit;
    text-decoration: underline;
    text-decoration-style: dotted;
    text-decoration-color: rgba(255, 255, 255, 0.5);
  }

  .rate-rule-link:hover {
    color: white;
    text-decoration-style: solid;
    text-decoration-color: white;
  }

  @media (max-width: 768px) {
    .region-row {
      flex-direction: column;
      gap: 0;
    }
  }
</style>
