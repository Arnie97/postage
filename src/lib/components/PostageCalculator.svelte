<script lang="ts">
  import { language } from '../utils/language';
  import { t, type TranslationKey } from '../data/translations';
  import {
    calculatePostageRate,
    type MailType,
    type PostageResult,
    type DeliveryMethod,
  } from '../utils/postal-rates';
  import { RATE_RULES } from '../data/rates';
  import { getRegionType, getChinaPostInternationalZone, POSTAL_ZONES } from '../data/regions';
  import RegionSelector from './RegionSelector.svelte';

  let selectedMailType: MailType = 'letter';
  let selectedDeliveryMethod: DeliveryMethod | null = null;
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

  // Get available delivery methods for the destination
  $: availableDeliveryMethods = getAvailableDeliveryMethods(originRegion, destinationRegion);

  // Set default delivery method when destination changes or method becomes unavailable
  $: {
    if (!isInternationalDestination) {
      selectedDeliveryMethod = null;
    } else if (!availableDeliveryMethods.includes(selectedDeliveryMethod as DeliveryMethod)) {
      // Set SAL as default if available, otherwise the first available method (usually air)
      if (availableDeliveryMethods.includes('sal')) {
        selectedDeliveryMethod = 'sal';
      } else if (availableDeliveryMethods.length > 0) {
        selectedDeliveryMethod = availableDeliveryMethods[0];
      } else {
        selectedDeliveryMethod = null;
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

  function getAvailableDeliveryMethods(origin: string, destination: string): DeliveryMethod[] {
    if (!origin || !destination) return [];

    const originType = getRegionType(origin);
    const destType = getRegionType(destination);

    // Only show delivery methods for China Post international mail
    if (originType !== 'CN' || destType !== 'XX') {
      return [];
    }

    const chinaPostZone = getChinaPostInternationalZone(destination);
    if (!chinaPostZone) return [];

    const methods: DeliveryMethod[] = [];
    if (chinaPostZone.air !== undefined) methods.push('air');
    if (chinaPostZone.sal !== undefined) methods.push('sal');
    if (chinaPostZone.surface !== undefined) methods.push('surface');

    return methods;
  }

  // Auto-calculate when inputs change
  $: {
    // Include selectedDeliveryMethod in dependencies to trigger recalculation
    selectedDeliveryMethod;
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
      'literature_for_blind',
      'parcel',
      'small_packet',
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
    const [prefix, deliveryMethod, mailType, zoneNumber] = zone.split('_');
    const zoneKey = {
      international: `${prefix}_${deliveryMethod}`,
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
      selectedDeliveryMethod || undefined,
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

    <!-- Delivery Method Selection (International Only) -->
    {#if isInternationalDestination && availableDeliveryMethods.length > 0}
      <div class="form-group">
        <fieldset class="fieldset-reset">
          <legend class="form-label">
            {t('delivery.method', currentLang)}
          </legend>
          <div class="radio-group">
            {#each availableDeliveryMethods as method}
              <label class="radio-item">
                <input
                  type="radio"
                  bind:group={selectedDeliveryMethod}
                  value={method}
                  name="deliveryMethod"
                />
                <span>{t(`delivery.method.${method}`, currentLang)}</span>
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
          {#if result.deliveryMethod}
            • {t(`delivery.method.${result.deliveryMethod}`, currentLang)}
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
