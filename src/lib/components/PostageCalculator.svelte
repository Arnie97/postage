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
  import { getRegionType, POSTAL_ZONES } from '../data/regions';
  import RegionSelector from './RegionSelector.svelte';

  let selectedMailType: MailType = 'letter';
  let selectedDeliveryMethod: DeliveryMethod | null = null;
  let originRegion = '';
  let destinationRegion = '';
  let weight = '';
  let result: PostageResult | null = null;
  let error = '';

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

  // Reset delivery method when destination changes
  $: {
    if (!isInternationalDestination) {
      selectedDeliveryMethod = null;
    }
  }

  // Auto-calculate when inputs change
  $: {
    if (originRegion && destinationRegion && weight && selectedMailType) {
      calculate();
    } else {
      result = null;
      error = '';
    }
  }

  function getAvailableMailTypes(origin: string, destination: string): MailType[] {
    if (!origin || !destination) {
      return ['postcard', 'letter', 'parcel', 'ems'];
    }

    const originType = getRegionType(origin);
    const destType = getRegionType(destination);
    const baseTypes: MailType[] = ['postcard', 'letter', 'parcel', 'ems'];

    // ePacket availability rules
    if (originType === 'CN' && destType === 'XX') {
      return [...baseTypes, 'epacket'];
    }
    if (originType === 'TW' && (destType === 'CN' || destType === 'XX')) {
      return [...baseTypes, 'epacket'];
    }
    if (originType === 'HK' && destType === 'XX') {
      return [...baseTypes, 'epacket'];
    }
    if (originType === 'MO' && destType === 'XX') {
      return [...baseTypes, 'epacket'];
    }

    return baseTypes;
  }

  const MAIL_TYPE_KEY_MAP = new Map<string, TranslationKey>([
    ['postcard', 'mail.type.postcard'],
    ['letter', 'mail.type.letter'],
    ['parcel', 'mail.type.parcel'],
    ['ems', 'mail.type.ems'],
    ['epacket', 'mail.type.epacket'],
  ]);

  function getMailTypeKey(mailType: string): TranslationKey {
    return MAIL_TYPE_KEY_MAP.get(mailType) || 'mail.type.letter';
  }

  // Unified service and currency configuration
  const SERVICE_CONFIG = {
    services: {
      'China Post': {
        translationKey: 'service.china-post' as TranslationKey,
        color: '#10b981', // Green
      },
      'Chunghwa Post': {
        translationKey: 'service.chunghwa-post' as TranslationKey,
        color: '#dc2626', // Red
      },
      'Hong Kong Post': {
        translationKey: 'service.hongkong-post' as TranslationKey,
        color: '#2563eb', // Blue
      },
      'Macau Post': {
        translationKey: 'service.macau-post' as TranslationKey,
        color: '#7c3aed', // Purple
      },
    },
    currencies: {
      CNY: 'currency.cny' as TranslationKey,
      TWD: 'currency.twd' as TranslationKey,
      HKD: 'currency.hkd' as TranslationKey,
      MOP: 'currency.mop' as TranslationKey,
    },
  };

  function getCurrencyKey(currency: string): TranslationKey {
    return (
      SERVICE_CONFIG.currencies[currency as keyof typeof SERVICE_CONFIG.currencies] ||
      'currency.cny'
    );
  }

  function getServiceKey(service: string): TranslationKey {
    return (
      SERVICE_CONFIG.services[service as keyof typeof SERVICE_CONFIG.services]?.translationKey ||
      'service.auto'
    );
  }

  function getServiceColor(service: string): string {
    return (
      SERVICE_CONFIG.services[service as keyof typeof SERVICE_CONFIG.services]?.color || '#10b981'
    ); // Default to green
  }

  function getZoneDescription(zone: string): string {
    const zoneNumber = parseInt(zone) as keyof typeof POSTAL_ZONES;
    return POSTAL_ZONES[zoneNumber] || '';
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
    {#if isInternationalDestination}
      <div class="form-group">
        <fieldset class="fieldset-reset">
          <legend class="form-label">
            {t('delivery.method', currentLang)}
          </legend>
          <div class="radio-group">
            <label class="radio-item">
              <input
                type="radio"
                bind:group={selectedDeliveryMethod}
                value="air"
                name="deliveryMethod"
              />
              <span>{t('delivery.method.air', currentLang)}</span>
            </label>
            <label class="radio-item">
              <input
                type="radio"
                bind:group={selectedDeliveryMethod}
                value="sal"
                name="deliveryMethod"
              />
              <span>{t('delivery.method.sal', currentLang)}</span>
            </label>
            <label class="radio-item">
              <input
                type="radio"
                bind:group={selectedDeliveryMethod}
                value="surface"
                name="deliveryMethod"
              />
              <span>{t('delivery.method.surface', currentLang)}</span>
            </label>
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
        placeholder="500"
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
        style="background: linear-gradient(135deg, {getServiceColor(
          result.service,
        )}, {getServiceColor(result.service)}dd);"
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
          {#if result.zone}
            • {getZoneDescription(result.zone)}
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
  }

  .rate-rule-link:hover {
    color: #e0e0e0;
  }

  @media (max-width: 768px) {
    .region-row {
      flex-direction: column;
      gap: 0;
    }
  }
</style>
