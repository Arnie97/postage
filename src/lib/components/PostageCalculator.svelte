<script lang="ts">
  import { language } from '../utils/language';
  import { calculatePostageRate, type CalculationResult } from '../services/calc';
  import { ALL_MAIL_TYPES, type MailType, type MailCategory } from '../data/mail-types';
  import {
    getDestinationType,
    getRegionType,
    getPostalZone,
    type RegionCode,
  } from '../data/regions';
  import { RATE_RULES, POSTAGE_RATES } from '../data/rates';
  import { t, s } from '../data/translations';
  import RegionSelector from './RegionSelector.svelte';

  let selectedMailType: MailType = 'letter';
  let selectedMailCategory: MailCategory | undefined;
  let fromRegion = 'CN-BJ';
  let toRegion = 'HK';
  let weight = '20';
  let isRegistered = false;
  let result: CalculationResult | null;
  let error = '';
  let previousMailType: MailType = 'letter';

  $: currentLang = $language;

  // Get available mail types based on origin and destination
  $: availableMailTypes = getAvailableMailTypes(fromRegion, toRegion);
  $: mailTypeAvailability = getMailTypeAvailability(fromRegion, toRegion);

  // Reset mail type if not available
  $: {
    if (availableMailTypes.length > 0 && !availableMailTypes.includes(selectedMailType)) {
      selectedMailType = availableMailTypes[0];
    }
  }

  // Get available mail categories for the destination
  $: availableMailCategories = getAvailableMailCategories(fromRegion, toRegion);

  // Set default mail category when destination changes or category becomes unavailable
  $: {
    if (!availableMailCategories.includes(selectedMailCategory as MailCategory)) {
      // Set SAL as default if available, otherwise the first available method (usually air)
      if (availableMailCategories.includes('sal')) {
        selectedMailCategory = 'sal';
      } else if (availableMailCategories.length > 0) {
        selectedMailCategory = availableMailCategories[0];
      } else {
        selectedMailCategory = undefined;
      }
    }
  }

  // Set default weight based on mail type only when mail type changes
  $: {
    switch (selectedMailType) {
      case previousMailType:
        break;
      case 'letter':
      case 'postcard':
      case 'aerogramme':
        weight = '20';
        break;
      case 'm_bags':
        weight = '5000';
        break;
      default:
        weight = '500';
    }
    previousMailType = selectedMailType;
  }

  function getAvailableMailCategories(fromRegion: string, toRegion: string): MailCategory[] {
    // Type guard: check if fromRegionType is a valid RegionCode
    const fromRegionType = getRegionType(fromRegion);
    if (fromRegionType === 'XX') {
      return [];
    }

    const postalZone = getPostalZone(fromRegionType, toRegion);
    if (!postalZone) return [];

    return Object.keys(postalZone) as MailCategory[];
  }

  // Auto-calculate when inputs change
  $: {
    // Include selectedMailCategory and isRegistered in dependencies to trigger recalculation
    void selectedMailCategory;
    void isRegistered;
    if (fromRegion && toRegion && weight && selectedMailType) {
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
    if (fromRegionType === 'XX') {
      return [];
    }
    const serviceData = POSTAGE_RATES[fromRegionType];
    // If no service found, all mail types are unavailable
    if (!serviceData) {
      return [];
    }

    // Determine destination type for rate lookup
    const toRegionType = getRegionType(destination);
    const destinationType = getDestinationType(fromRegionType, toRegionType);
    const destinationRates = serviceData.rates[destinationType];

    return ALL_MAIL_TYPES.map((mailType) => {
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

  function calculate() {
    error = '';
    result = null;

    const weightNum = parseFloat(weight);
    if (!weight || isNaN(weightNum) || weightNum <= 0) {
      error = t('error.weight', currentLang);
      return;
    }

    if (!fromRegion || !toRegion) {
      error = t('error.route', currentLang);
      return;
    }

    const calculatedResult = calculatePostageRate(
      selectedMailType,
      fromRegion,
      toRegion,
      weightNum,
      selectedMailCategory,
      isRegistered,
    );

    if ('errorType' in calculatedResult) {
      error = s('error', calculatedResult.errorType, currentLang);
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
          bind:selectedRegion={fromRegion}
          label={t('sender', currentLang)}
          isDestination={false}
        />
      </div>
      <div class="region-col">
        <RegionSelector
          bind:selectedRegion={toRegion}
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
                  {s('mail.type', mailType, currentLang)}
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

    <!-- Mail Category Selection -->
    {#if availableMailCategories.length > 0}
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
      {@const serviceData = POSTAGE_RATES[getRegionType(fromRegion) as RegionCode]}
      {@const currency = s('currency', serviceData.currency.toLowerCase(), currentLang)}
      <div
        class="result-card"
        style="background: linear-gradient(135deg,
        {serviceData.primaryColor || 'white'},
        {serviceData.secondaryColor || 'white'});"
      >
        <div class="result-price">
          {result.price.toFixed(2)}
          {currency}
        </div>
        <div class="result-details">
          {s('service', serviceData.nameKey, currentLang)} •
          {#if isRegistered}{t('mail.supplement.registered', currentLang)}{/if}{s(
            'mail.type',
            selectedMailType,
            currentLang,
          )}
          {#if result.ruleId}
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
          {#if selectedMailCategory}
            <p>{t(`mail.category.${selectedMailCategory}`, currentLang)}</p>
          {/if}
          {#if result.calculationDetails.zoneDescription}
            <p>{result.calculationDetails.zoneDescription}</p>
          {/if}

          {#if result.calculationDetails.rateType === 'fixed'}
            <p>
              {t('calculation.fixed-rate', currentLang)}:
              {result.calculationDetails.basePrice?.toFixed(2)}
              {currency}
            </p>
          {:else if result.calculationDetails.rateType === 'stepped' || result.calculationDetails.rateType === 'zonal'}
            {#if result.calculationDetails.baseWeight !== undefined}
              <p>
                {t('calculation.base-weight', currentLang)}:
                {result.calculationDetails.baseWeight}
                {t('weight.grams', currentLang)},
                {result.calculationDetails.basePrice?.toFixed(2)}
                {currency}
              </p>
            {/if}
            {#if result.calculationDetails.weightStep && (result.calculationDetails.additionalWeight ?? 0) > 0}
              <p>
                {t('calculation.additional-weight', currentLang)}:
                {result.calculationDetails.stepMinWeight}
                {t('weight.grams', currentLang)} -
                {result.calculationDetails.stepMaxWeight}
                {t('weight.grams', currentLang)}
                ({result.calculationDetails.additionalWeight}
                {t('weight.grams', currentLang)}),
                {result.calculationDetails.additionalPrice?.toFixed(2)}
                {currency} /
                {result.calculationDetails.weightStep}
                {t('weight.grams', currentLang)}
              </p>
            {/if}
          {:else if result.calculationDetails.rateType === 'tiered'}
            <p>
              {t('calculation.tier-range', currentLang)}:
              {result.calculationDetails.baseWeight || 0}
              {t('weight.grams', currentLang)} –
              {result.calculationDetails.maxWeight}
              {t('weight.grams', currentLang)},
              {result.calculationDetails.basePrice?.toFixed(2)}
              {currency}
            </p>
          {/if}
          {#if result.calculationDetails.registrationFee}
            <p>
              {t('calculation.registration-fee', currentLang)}:
              {result.calculationDetails.registrationFee.toFixed(2)}
              {currency}
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
