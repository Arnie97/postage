<script lang="ts">
  import { language } from '../utils/language';
  import { t, type TranslationKey } from '../data/translations';
  import {
    calculatePostageRate,
    type MailType,
    type PostageResult,
    type MailCategory,
  } from '../utils/postal-rates';
  import { RATE_RULES, POSTAGE_RATES } from '../data/rates';
  import { getRegionType, getChinaPostInternationalZone, POSTAL_ZONES } from '../data/regions';
  import RegionSelector from './RegionSelector.svelte';

  let selectedMailType: MailType = 'letter';
  let selectedMailCategory: MailCategory | null = null;
  let originRegion = 'CN-BJ';
  let destinationRegion = 'HK';
  let weight = '20';
  let isRegistered = false;
  let result: PostageResult | null = null;
  let error = '';
  let previousMailType: MailType = 'letter';

  $: currentLang = $language;

  // Get available mail types based on origin and destination
  $: availableMailTypes = getAvailableMailTypes(originRegion, destinationRegion);
  $: mailTypeAvailability = getMailTypeAvailability(originRegion, destinationRegion);

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
      } else if (
        selectedMailType === 'printed_papers' ||
        selectedMailType === 'parcel' ||
        selectedMailType === 'small_packet'
      ) {
        weight = '500';
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
    // Include selectedMailCategory and isRegistered in dependencies to trigger recalculation
    selectedMailCategory;
    isRegistered;
    if (originRegion && destinationRegion && weight && selectedMailType) {
      calculate();
    } else {
      result = null;
      error = '';
    }
  }

  interface MailTypeAvailability {
    mailType: MailType;
    status: 'available' | 'todo' | 'unavailable';
  }

  function getMailTypeAvailability(origin: string, destination: string): MailTypeAvailability[] {
    const fromRegionType = getRegionType(origin);
    const toRegionType = getRegionType(destination);

    // Find the service by matching fromRegion
    let serviceData: any = null;
    for (const [key, data] of Object.entries(POSTAGE_RATES)) {
      if (data.fromRegion === fromRegionType) {
        serviceData = data;
        break;
      }
    }

    // If no service found, all mail types are unavailable
    if (!serviceData) {
      return (
        [
          'letter',
          'postcard',
          'printed_papers',
          'items_for_blind',
          'small_packet',
          'm_bags',
          'parcel',
        ] as MailType[]
      ).map((mailType) => ({ mailType, status: 'unavailable' as const }));
    }

    // Determine destination type for rate lookup
    let destinationType: string;
    if (toRegionType === fromRegionType) {
      destinationType = 'domestic';
    } else if (toRegionType === 'CN' && fromRegionType !== 'CN') {
      destinationType = 'mainland';
    } else if (
      (toRegionType === 'TW' || toRegionType === 'HK' || toRegionType === 'MO') &&
      fromRegionType !== toRegionType
    ) {
      destinationType = 'regional';
    } else if (toRegionType === 'TW' && fromRegionType === 'MO') {
      destinationType = 'regional_tw';
    } else {
      destinationType = 'international';
    }

    const destinationRates = serviceData.rates[destinationType];

    return (
      [
        'letter',
        'postcard',
        'printed_papers',
        'items_for_blind',
        'small_packet',
        'm_bags',
        'parcel',
      ] as MailType[]
    ).map((mailType) => {
      if (!destinationRates) {
        return { mailType, status: 'unavailable' as const };
      }

      const rateConfig = destinationRates[mailType];
      if (rateConfig === undefined) {
        return { mailType, status: 'unavailable' as const };
      } else if (rateConfig === null) {
        return { mailType, status: 'todo' as const };
      } else {
        return { mailType, status: 'available' as const };
      }
    });
  }

  function getAvailableMailTypes(origin: string, destination: string): MailType[] {
    return getMailTypeAvailability(origin, destination)
      .filter((item) => item.status !== 'unavailable')
      .map((item) => item.mailType);
  }

  function getMailTypeKey(mailType: string): TranslationKey {
    return `mail.type.${mailType}` as TranslationKey;
  }

  function getCurrencyKey(currency: string): TranslationKey {
    return `currency.${currency.toLowerCase()}` as TranslationKey;
  }

  function getServiceNameKey(serviceKey: string): TranslationKey {
    return POSTAGE_RATES[serviceKey]?.nameKey as TranslationKey;
  }

  function getServicePrimaryColor(serviceKey: string): string {
    return POSTAGE_RATES[serviceKey]?.primaryColor || '#059669';
  }

  function getServiceSecondaryColor(serviceKey: string): string {
    return POSTAGE_RATES[serviceKey]?.secondaryColor || '#f59e0b';
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
      isRegistered,
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

    <!-- Mail Type and Weight Row -->
    <div class="mail-type-weight-row">
      <div class="mail-type-col">
        <!-- Mail Type Selection -->
        <div class="form-group">
          <label class="form-label" for="mailType">
            {t('mail.type', currentLang)}
          </label>

          <select id="mailType" class="form-control select" bind:value={selectedMailType} required>
            {#each mailTypeAvailability as { mailType, status }}
              {#if status !== 'unavailable'}
                <option value={mailType} disabled={status === 'todo'}>
                  {t(getMailTypeKey(mailType), currentLang)}
                  {#if status === 'todo'}
                    ({t('mail.type.todo', currentLang)})
                  {/if}
                </option>
              {/if}
            {/each}
          </select>
        </div>
      </div>
      <div class="weight-col">
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
      </div>
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

    <!-- Registered Mail Option -->
    <div class="form-group">
      <fieldset class="fieldset-reset">
        <legend class="form-label">
          {t('mail.supplement', currentLang)}
        </legend>
        <div class="checkbox-group">
          <label class="checkbox-item">
            <input type="checkbox" bind:checked={isRegistered} name="registeredMail" />
            <span>{t('mail.supplement.registered', currentLang)}</span>
          </label>
        </div>
      </fieldset>
    </div>

    <!-- Result Display -->
    {#if result}
      <div
        class="result-card"
        style="background: linear-gradient(135deg,
        {getServicePrimaryColor(result.serviceKey)},
        {getServiceSecondaryColor(result.serviceKey)});"
      >
        <div class="result-price">
          {result.price.toFixed(2)}
          {t(getCurrencyKey(result.currency), currentLang)}
        </div>
        <div class="result-details">
          {t(getServiceNameKey(result.serviceKey), currentLang)} •
          {#if result.isRegistered}{t('mail.supplement.registered', currentLang)}{/if}{t(
            getMailTypeKey(result.mailType),
            currentLang,
          )}
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

        <!-- Rate Calculation Details -->
        <div class="calculation-details">
          {#if result.mailCategory}
            <p>{t(`mail.category.${result.mailCategory}`, currentLang)}</p>
          {/if}
          {#if result.zoneId}
            <p>{getZoneDescription(result.zoneId)}</p>
          {/if}

          {#if result.calculationDetails.rateType === 'fixed'}
            <p>
              {t('calculation.fixed-rate', currentLang)}:
              {result.calculationDetails.fixedPrice?.toFixed(2)}
              {t(getCurrencyKey(result.currency), currentLang)}
            </p>
          {:else if result.calculationDetails.rateType === 'stepped' || result.calculationDetails.rateType === 'region_stepped'}
            {#if result.calculationDetails.baseWeight !== undefined}
              <p>
                {t('calculation.base-weight', currentLang)}:
                {result.calculationDetails.baseWeight}g,
                {result.calculationDetails.basePrice?.toFixed(2)}
                {t(getCurrencyKey(result.currency), currentLang)}
              </p>
            {/if}
            {#if result.calculationDetails.additionalWeight !== undefined && result.calculationDetails.additionalWeight > 0}
              <p>
                {t('calculation.additional-weight', currentLang)}:
                {result.calculationDetails.additionalWeight}g,
                {result.calculationDetails.additionalPrice?.toFixed(2)}
                {t(getCurrencyKey(result.currency), currentLang)}
              </p>
            {/if}
          {:else if result.calculationDetails.rateType === 'tiered' && result.calculationDetails.tierUsed}
            <p>
              {t('calculation.tier-range', currentLang)}:
              {result.calculationDetails.tierUsed.minWeight || 0}g –
              {result.calculationDetails.tierUsed.maxWeight}g,
              {result.calculationDetails.tierUsed.price.toFixed(2)}
              {t(getCurrencyKey(result.currency), currentLang)}
            </p>
          {/if}
          {#if result.calculationDetails.registrationFee !== undefined}
            <p>
              {t('calculation.registration-fee', currentLang)}:
              {result.calculationDetails.registrationFee.toFixed(2)}
              {t(getCurrencyKey(result.currency), currentLang)}
            </p>
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

  .mail-type-weight-row {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .mail-type-col {
    flex: 1;
  }

  .weight-col {
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

  .calculation-details {
    margin-top: 0.75rem;
    padding: 0.5rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 0.25rem;
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.4;
  }

  .checkbox-group {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .checkbox-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: var(--border-radius);
    transition: background-color 0.2s ease;
  }

  .checkbox-item:hover {
    background: var(--bg-tertiary);
  }

  @media (max-width: 768px) {
    .region-row {
      flex-direction: column;
      gap: 0;
    }

    .mail-type-weight-row {
      flex-direction: column;
      gap: 0;
    }
  }
</style>
