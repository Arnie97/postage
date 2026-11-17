// @vitest-environment jsdom
/* global Event, HTMLDivElement, HTMLInputElement, HTMLSelectElement */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { flushSync, mount, unmount } from 'svelte';
import PostageCalculator from './PostageCalculator.svelte';
import { POSTAGE_RATES, type Rate } from '../data/rates';
import { setLanguage } from '../utils/language';

describe('included supplementary services', () => {
  let target: HTMLDivElement;
  let component: ReturnType<typeof mount> | undefined;

  function checkbox(name: string): HTMLInputElement {
    const element = target.querySelector<HTMLInputElement>(`input[name="${name}"]`);
    if (!element) throw new Error(`Checkbox not found: ${name}`);
    return element;
  }

  function start(mailType: 'letter' | 'parcel') {
    component = mount(PostageCalculator, { target });
    flushSync();
    const destination = target.querySelector<HTMLSelectElement>('#To')!;
    destination.value = 'CN-SH';
    destination.dispatchEvent(new Event('change', { bubbles: true }));
    flushSync();
    if (mailType === 'parcel') selectMailType('parcel');
  }

  function selectMailType(mailType: string) {
    const select = target.querySelector<HTMLSelectElement>('#mailType')!;
    select.value = mailType;
    select.dispatchEvent(new Event('change', { bubbles: true }));
    flushSync();
  }

  function totalPrice() {
    return target.querySelector('.result-price')?.textContent?.trim();
  }

  beforeEach(() => {
    localStorage.clear();
    setLanguage('en');
    component = undefined;
    target = document.createElement('div');
    document.body.appendChild(target);
  });

  afterEach(() => {
    if (component) unmount(component);
    target.remove();
  });

  it('keeps parcel registration and delivery checked and free when insurance is selected', () => {
    start('parcel');
    expect(checkbox('registeredMail').checked).toBe(true);
    expect(checkbox('registeredMail').disabled).toBe(true);
    expect(checkbox('doorstepDelivery').checked).toBe(true);
    expect(checkbox('doorstepDelivery').disabled).toBe(true);
    expect(totalPrice()).toContain('8.00');
    expect(target.querySelector('.result-details')?.textContent).toContain('Registered');

    checkbox('registeredMail').click();
    checkbox('doorstepDelivery').click();
    checkbox('insuredMail').click();
    flushSync();

    expect(checkbox('registeredMail').checked).toBe(true);
    expect(checkbox('doorstepDelivery').checked).toBe(true);
    expect(totalPrice()).toContain('10.00');
    expect(target.querySelector('.calculation-details')?.textContent).not.toContain(
      'Registration Fee',
    );
    expect(target.querySelector('.calculation-details')?.textContent).not.toContain(
      'Doorstep Delivery',
    );

    checkbox('adviceOfReceipt').click();
    flushSync();
    expect(checkbox('registeredMail').checked).toBe(true);
    expect(checkbox('doorstepDelivery').checked).toBe(true);
    expect(totalPrice()).toContain('13.00');
  });

  it('does not carry automatically included services over as paid selections', () => {
    start('parcel');
    selectMailType('letter');

    expect(checkbox('registeredMail').disabled).toBe(false);
    expect(checkbox('registeredMail').checked).toBe(false);
    expect(checkbox('doorstepDelivery').disabled).toBe(false);
    expect(checkbox('doorstepDelivery').checked).toBe(false);
    expect(totalPrice()).toContain('1.20');

    checkbox('insuredMail').click();
    flushSync();
    expect(checkbox('registeredMail').checked).toBe(true);
    expect(totalPrice()).toContain('6.20');

    selectMailType('parcel');
    expect(checkbox('registeredMail').checked).toBe(true);
    expect(checkbox('registeredMail').disabled).toBe(true);
    expect(totalPrice()).toContain('10.00');

    selectMailType('letter');
    expect(checkbox('registeredMail').checked).toBe(true);
    expect(checkbox('registeredMail').disabled).toBe(false);
    expect(totalPrice()).toContain('6.20');

    checkbox('registeredMail').click();
    flushSync();
    expect(checkbox('insuredMail').checked).toBe(false);
    expect(totalPrice()).toContain('1.20');
  });

  it('does not turn on paid registration for an included advice of receipt', () => {
    const letter = POSTAGE_RATES.CN.rates.domestic!.letter as Rate;
    const previousSupplements = letter.supplements;
    letter.supplements = { ...previousSupplements, adviceOfReceipt: 0 };

    try {
      start('letter');
      expect(checkbox('adviceOfReceipt').checked).toBe(true);
      expect(checkbox('adviceOfReceipt').disabled).toBe(true);
      expect(checkbox('registeredMail').checked).toBe(false);
      expect(totalPrice()).toContain('1.20');

      checkbox('registeredMail').click();
      flushSync();
      expect(totalPrice()).toContain('4.20');
      checkbox('registeredMail').click();
      flushSync();
      expect(checkbox('adviceOfReceipt').checked).toBe(true);
      expect(checkbox('adviceOfReceipt').disabled).toBe(true);
      expect(totalPrice()).toContain('1.20');

      selectMailType('postcard');
      expect(checkbox('adviceOfReceipt').disabled).toBe(false);
      expect(checkbox('adviceOfReceipt').checked).toBe(false);
      expect(target.querySelector('input[name="doorstepDelivery"]')).toBeNull();
      expect(totalPrice()).toContain('0.80');
    } finally {
      letter.supplements = previousSupplements;
    }
  });

  it('shows included services even when registration is unavailable', () => {
    const destinationRates = POSTAGE_RATES.CN.rates.domestic!;
    const letter = destinationRates.letter as Rate;
    const previousDestinationSupplements = destinationRates.supplements;
    const previousLetterSupplements = letter.supplements;
    destinationRates.supplements = {
      ...previousDestinationSupplements,
      registrationFee: undefined,
    };
    letter.supplements = { ...previousLetterSupplements, doorstepDelivery: 0, adviceOfReceipt: 0 };

    try {
      start('letter');
      expect(target.querySelector('input[name="registeredMail"]')).toBeNull();
      expect(checkbox('doorstepDelivery').checked).toBe(true);
      expect(checkbox('doorstepDelivery').disabled).toBe(true);
      expect(checkbox('adviceOfReceipt').checked).toBe(true);
      expect(checkbox('adviceOfReceipt').disabled).toBe(true);
      expect(totalPrice()).toContain('1.20');
    } finally {
      destinationRates.supplements = previousDestinationSupplements;
      letter.supplements = previousLetterSupplements;
    }
  });
});
