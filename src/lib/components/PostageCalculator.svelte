<script lang="ts">
  import { language } from '../utils/language';
  import { calculatePostage, type CalculationResult, getPricingModel } from '../services/calc';
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
  let previousMailType: MailType = selectedMailType;
  let selectedMailCategory: MailCategory | undefined;
  let fromRegion = 'CN-BJ';
  let toRegion = 'HK';
  let weight = '20';
  let isRegistered = false;
  let isInsured = false;
  let packageValue = '200';
  let discountRuleIndex: number | undefined;
  let hasStampDiscount = false;
  let stampPricePercent = '45';
  let result: CalculationResult | null;
  let error = '';

  $: currentLang = $language;

  // Get available mail types based on origin and destination
  $: availableMailTypes = getAvailableMailTypes(fromRegion, toRegion);

  // Reset mail type if not available
  $: {
    if (!availableMailTypes.includes(selectedMailType)) {
      selectedMailType = availableMailTypes[0];
    }
  }

  // Get available mail categories for the destination
  $: availableMailCategories = getAvailableMailCategories(fromRegion, toRegion, selectedMailType);

  // Get available discount rules for the current rate
  $: availableDiscountRules = getAvailableDiscountRules(
    fromRegion,
    toRegion,
    selectedMailType,
    selectedMailCategory,
  );

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

  // Reset discount rule selection when it's no longer available
  $: {
    if (discountRuleIndex !== undefined && discountRuleIndex >= availableDiscountRules.length) {
      discountRuleIndex = undefined;
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

  function getAvailableMailCategories(
    fromRegion: string,
    toRegion: string,
    mailType: MailType,
  ): MailCategory[] {
    // Type guard: check if fromRegionType is a valid RegionCode
    const fromRegionType = getRegionType(fromRegion);
    if (fromRegionType === 'XX') {
      return [];
    }

    const postalZone = getPostalZone(fromRegionType, toRegion);
    if (postalZone) {
      return Object.getOwnPropertyNames(postalZone) as MailCategory[];
    }

    const serviceData = POSTAGE_RATES[fromRegionType];
    if (!serviceData) {
      return [];
    }
    const toRegionType = getRegionType(toRegion);
    const destinationType = getDestinationType(fromRegionType, toRegionType);
    const rate = serviceData.rates[destinationType]?.[mailType];
    if (!rate || 'type' in rate) {
      return [];
    }
    return Object.getOwnPropertyNames(rate) as MailCategory[];
  }

  function getAvailableDiscountRules(
    fromRegion: string,
    toRegion: string,
    mailType: MailType,
    mailCategory?: MailCategory,
  ) {
    // Type guard: check if fromRegionType is a valid RegionCode
    const fromRegionType = getRegionType(fromRegion);
    if (fromRegionType === 'XX') {
      return [];
    }

    const serviceData = POSTAGE_RATES[fromRegionType];
    if (!serviceData) {
      return [];
    }

    const toRegionType = getRegionType(toRegion);
    const destinationType = getDestinationType(fromRegionType, toRegionType);
    const destinationRates = serviceData.rates[destinationType];
    if (!destinationRates) {
      return [];
    }

    const rate = getPricingModel(destinationRates[mailType], mailCategory);
    return rate?.discounts || [];
  }

  // Auto-calculate when inputs change
  $: {
    // Include selectedMailCategory, isRegistered, isInsured, packageValue, discountRuleIndex, hasStampDiscount, and stampPricePercent in dependencies to trigger recalculation
    void selectedMailCategory;
    void isRegistered;
    void isInsured;
    void packageValue;
    void discountRuleIndex;
    void hasStampDiscount;
    void stampPricePercent;
    if (fromRegion && toRegion && weight && selectedMailType) {
      calculate();
    } else {
      result = null;
      error = '';
    }
  }

  function getAvailableMailTypes(origin: string, destination: string): MailType[] {
    const fromRegionType = getRegionType(origin);
    if (fromRegionType === 'XX') {
      return [];
    }

    // If no service found, all mail types are unavailable
    const serviceData = POSTAGE_RATES[fromRegionType];
    if (!serviceData) {
      return [];
    }

    // Determine destination type for rate lookup
    const toRegionType = getRegionType(destination);
    const destinationType = getDestinationType(fromRegionType, toRegionType);
    const destinationRates = serviceData.rates[destinationType];

    return ALL_MAIL_TYPES.filter((mailType) => destinationRates?.[mailType]);
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

    let packageValueNum = undefined;
    if (isInsured && packageValue) {
      packageValueNum = parseFloat(packageValue);
      if (isNaN(packageValueNum) || packageValueNum <= 0) {
        error = t('error.package_value', currentLang);
        return;
      }
    }

    const calculatedResult = calculatePostage(
      selectedMailType,
      fromRegion,
      toRegion,
      weightNum,
      selectedMailCategory,
      isRegistered,
      packageValueNum,
      discountRuleIndex,
      hasStampDiscount && stampPricePercent ? parseFloat(stampPricePercent) : undefined,
    );

    if ('errorType' in calculatedResult) {
      error = s('error', calculatedResult.errorType, currentLang);
      return;
    }

    if (!isRegistered && isInsured && calculatedResult.supplements.insuranceCommission) {
      isRegistered = true;
      return calculate();
    }

    result = calculatedResult;
  }
</script>

<div class="card">
  <div class="card-content">
    <!-- Region Selection Row -->
    <div class="pair-row">
      <div class="half-col">
        <RegionSelector
          bind:selectedRegion={fromRegion}
          label={t('sender', currentLang)}
          isDestination={false}
        />
      </div>
      <div class="half-col">
        <RegionSelector
          bind:selectedRegion={toRegion}
          label={t('receiver', currentLang)}
          isDestination={true}
        />
      </div>
    </div>

    <!-- Mail Type and Weight Row -->
    <div class="pair-row">
      <div class="half-col">
        <!-- Mail Type Selection -->
        <div class="form-group">
          <label class="form-label" for="mailType">
            {t('mail.type', currentLang)}
          </label>

          <select id="mailType" class="form-control select" bind:value={selectedMailType} required>
            {#each availableMailTypes as mailType}
              <option value={mailType}>
                {s('mail.type', mailType, currentLang)}
              </option>
            {/each}
          </select>
        </div>
      </div>
      <div class="half-col">
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
          <label class="checkbox-item">
            <input type="checkbox" bind:checked={isInsured} name="insuredMail" />
            <span>{t('mail.supplement.insured', currentLang)}</span>
          </label>
          <label class="checkbox-item">
            <input type="checkbox" bind:checked={hasStampDiscount} name="stampDiscount" />
            <span>{t('calculation.stamp-discount', currentLang)}</span>
          </label>
        </div>
        <!-- Package Value Input (shown when insurance is enabled) -->
      </fieldset>
    </div>

    {#if isInsured}
      <div class="form-group">
        <label for="packageValue" class="form-label">
          {t('mail.supplement.package-value', currentLang)}
        </label>
        <input
          id="packageValue"
          type="number"
          min="0"
          step="0.01"
          bind:value={packageValue}
          class="form-control"
        />
      </div>
    {/if}

    {#if hasStampDiscount}
      <div class="form-group">
        <label for="stampDiscount" class="form-label">
          {t('calculation.stamp-discount', currentLang)} (%)
        </label>
        <input
          id="stampDiscount"
          type="number"
          min="1"
          max="100"
          step="1"
          bind:value={stampPricePercent}
          class="form-control"
        />
      </div>
    {/if}

    <!-- Discount Rules Selection -->
    {#if availableDiscountRules.length > 0}
      <div class="form-group">
        <fieldset class="fieldset-reset">
          <legend class="form-label">
            {t('calculation.rule-discount', currentLang)}
          </legend>
          <div class="radio-group">
            <label class="radio-item">
              <input
                type="radio"
                bind:group={discountRuleIndex}
                value={undefined}
                name="discountRule"
              />
              <span>None</span>
            </label>
            {#each availableDiscountRules as rule, index}
              <label class="radio-item">
                <input
                  type="radio"
                  bind:group={discountRuleIndex}
                  value={index}
                  name="discountRule"
                />
                <span>{rule.name[currentLang]} ({rule.pricePercent}%)</span>
              </label>
            {/each}
          </div>
        </fieldset>
      </div>
    {/if}

    {#if error}
      <div class="error-message">{error}</div>
    {/if}

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
          {#if result.supplements.discountedPrice}
            <span class="original-price">
              {result.supplements.originalPrice.toFixed(2)}
            </span>
            {result.supplements.discountedPrice.toFixed(2)}
            {currency}
          {:else}
            {result.supplements.originalPrice.toFixed(2)}
            {currency}
          {/if}
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
          {#if result.details.zoneDescription}
            <p>{result.details.zoneDescription}</p>
          {/if}

          {#if result.details.rateType === 'fixed'}
            <p>
              {t('calculation.fixed-rate', currentLang)}:
              {result.details.basePrice?.toFixed(2)}
              {currency}
            </p>
          {:else if result.details.rateType === 'stepped'}
            {#if result.details.baseWeight !== undefined}
              <p>
                {t('calculation.base-weight', currentLang)}:
                {result.details.baseWeight}
                {t('weight.grams', currentLang)},
                {result.details.basePrice?.toFixed(2)}
                {currency}
              </p>
            {/if}
            {#if result.details.weightStep && (result.details.additionalWeight ?? 0) > 0}
              <p>
                {t('calculation.additional-weight', currentLang)}:
                {result.details.stepMinWeight}
                {t('weight.grams', currentLang)} -
                {result.details.stepMaxWeight}
                {t('weight.grams', currentLang)}
                ({result.details.additionalWeight}
                {t('weight.grams', currentLang)}),
                {result.details.additionalPrice?.toFixed(2)}
                {currency} /
                {result.details.weightStep}
                {t('weight.grams', currentLang)}
              </p>
            {/if}
          {:else if result.details.rateType === 'tiered'}
            <p>
              {t('calculation.tier-range', currentLang)}:
              {result.details.baseWeight || 0}
              {t('weight.grams', currentLang)} –
              {result.details.maxWeight}
              {t('weight.grams', currentLang)},
              {result.details.basePrice?.toFixed(2)}
              {currency}
            </p>
          {/if}
          {#if result.supplements.registrationFee}
            <p>
              {t('calculation.registration-fee', currentLang)}:
              {result.supplements.registrationFee.toFixed(2)}
              {currency}
            </p>
          {/if}
          {#if result.supplements.insuranceCommission}
            <p>
              {t('calculation.insurance-commission', currentLang)}:
              {result.supplements.insuranceCommission.toFixed(2)}
              {currency}
            </p>
          {/if}
          {#if result.supplements.insuranceFee}
            <p>
              {t('calculation.insurance-fee', currentLang)}:
              {result.supplements.insuranceFee.toFixed(2)}
              {currency}
            </p>
          {/if}

          <!-- Discount Information -->
          {#if result.supplements.ruleDiscount}
            <p>
              {t('calculation.rule-discount', currentLang)}: -{result.supplements.ruleDiscount.toFixed(
                2,
              )}
              {currency}
            </p>
          {/if}
          {#if result.supplements.stampDiscount}
            <p>
              {t('calculation.stamp-discount', currentLang)}: -{result.supplements.stampDiscount.toFixed(
                2,
              )}
              {currency}
            </p>
          {/if}
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .pair-row {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  @media (max-width: 768px) {
    .pair-row {
      flex-direction: column;
      gap: 0;
    }
  }

  .half-col {
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

  .original-price {
    text-decoration: line-through;
    opacity: 0.7;
    margin-right: 0.5rem;
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
</style>
