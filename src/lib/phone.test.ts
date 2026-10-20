import { describe, expect, it } from 'vitest';
import { formatPhoneInput, normalizePakistaniMobile, normalizePhone } from './phone';

describe('formatPhoneInput (as you type)', () => {
  it('formats Pakistani mobiles as 03XX-XXXXXXX', () => {
    expect(formatPhoneInput('0300', '+92')).toBe('0300');
    expect(formatPhoneInput('03001', '+92')).toBe('0300-1');
    expect(formatPhoneInput('03001234567', '+92')).toBe('0300-1234567');
    expect(formatPhoneInput('0300-12345678', '+92')).toBe('0300-1234567'); // capped at 11 digits
    expect(formatPhoneInput('3001234567', '+92')).toBe('300-1234567');
  });

  it('leaves international and overseas numbers as typed', () => {
    expect(formatPhoneInput('+92 300 1234567', '+92')).toBe('+92 300 1234567');
    expect(formatPhoneInput('050 123 4567', '+971')).toBe('050 123 4567');
  });

  it('formatted input still normalises', () => {
    expect(normalizePhone(formatPhoneInput('03001226381', '+92'))).toBe('+923001226381');
  });
});

describe('normalizePakistaniMobile', () => {
  it.each([
    ['03001226381', '+923001226381'],
    ['0300-1226381', '+923001226381'],
    ['0300 1226381', '+923001226381'],
    ['+923001226381', '+923001226381'],
    ['+92 300 1226381', '+923001226381'],
    ['00923001226381', '+923001226381'],
    ['923001226381', '+923001226381'],
    ['3001226381', '+923001226381'],
  ])('%s → %s', (input, expected) => {
    expect(normalizePakistaniMobile(input)).toBe(expected);
  });

  it.each(['0300122638', '030012263810', '04212345678', '+9230012263', 'abc', ''])('rejects %s', (input) => {
    expect(normalizePakistaniMobile(input)).toBeNull();
  });
});

describe('normalizePhone', () => {
  it('defaults to Pakistan', () => {
    expect(normalizePhone('0300-1226381')).toBe('+923001226381');
  });

  it('uses the selected overseas country code', () => {
    expect(normalizePhone('050 123 4567', '+971')).toBe('+971501234567');
    expect(normalizePhone('07700 900123', '+44')).toBe('+447700900123');
    expect(normalizePhone('(416) 555-0199', '+1')).toBe('+14165550199');
  });

  it('lets a typed international prefix win over the selector', () => {
    expect(normalizePhone('+971501234567', '+92')).toBe('+971501234567');
    expect(normalizePhone('00966501234567', '+92')).toBe('+966501234567');
    expect(normalizePhone('+923001226381', '+44')).toBe('+923001226381');
  });

  it('rejects junk', () => {
    expect(normalizePhone('12', '+971')).toBeNull();
    expect(normalizePhone('', '+92')).toBeNull();
    expect(normalizePhone('+12', '+92')).toBeNull();
  });
});
