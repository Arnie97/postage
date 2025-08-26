<script lang="ts">
  import { language } from '../stores/language';
  import { t, type TranslationKey } from '../data/translations';
  import { calculatePostageRate, type MailType, type PostageResult } from '../utils/postal-rates';
  import { getRegionType, POSTAL_ZONES } from '../data/regions';
  import RegionSelector from './RegionSelector.svelte';

  let selectedMailType: MailType = 'letter';
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
      return ['letter', 'parcel', 'ems'];
    }

    const originType = getRegionType(origin);
    const destType = getRegionType(destination);
    const baseTypes: MailType[] = ['letter', 'parcel', 'ems'];

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
    ['letter', 'mail.type.letter'],
    ['parcel', 'mail.type.parcel'],
    ['ems', 'mail.type.ems'],
    ['epacket', 'mail.type.epacket'],
  ]);

  function getMailTypeKey(mailType: string): TranslationKey {
    return MAIL_TYPE_KEY_MAP.get(mailType) || 'mail.type.letter';
  }

  const CURRENCY_KEY_MAP = new Map<string, TranslationKey>([
    ['CNY', 'currency.cny'],
    ['TWD', 'currency.twd'],
    ['HKD', 'currency.hkd'],
    ['MOP', 'currency.mop'],
  ]);

  function getCurrencyKey(currency: string): TranslationKey {
    return CURRENCY_KEY_MAP.get(currency) || 'currency.cny';
  }

  const SERVICE_KEY_MAP = new Map<string, TranslationKey>([
    ['China Post', 'service.china-post'],
    ['Chunghwa Post', 'service.chunghwa-post'],
    ['Hong Kong Post', 'service.hongkong-post'],
    ['Macau Post', 'service.macau-post'],
  ]);

  function getServiceKey(service: string): TranslationKey {
    return SERVICE_KEY_MAP.get(service) || 'service.auto';
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
      <div class="result-card">
        <div class="result-price">
          {result.price.toFixed(2)}
          {t(getCurrencyKey(result.currency), currentLang)}
        </div>
        <div class="result-details">
          {t(getServiceKey(result.service), currentLang)} •
          {t(getMailTypeKey(result.mailType), currentLang)}
          {#if result.zone}
            • {getZoneDescription(result.zone)}
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

  @media (max-width: 768px) {
    .region-row {
      flex-direction: column;
      gap: 0;
    }
  }
</style>
