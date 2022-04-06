import {isValidDomain, isValidGuid} from './util';

describe('input sanitation should work', () => {
	it('should pass valid domains', () => {
		expect(isValidDomain('https://fobar.com')).toBe(true);
		expect(isValidDomain('http://google.com')).toBe(true);
	});

	it('should fail invalid domains', () => {
		expect(isValidDomain('foobar')).toBe(false);
		expect(isValidDomain('asdasd')).toBe(false);
		expect(isValidDomain('httpss://foo.bar.com')).toBe(false);
	});

	it('should pass valid guid', () => {
		expect(isValidGuid('17709f4f-d5fd-431d-b2aa-e95069bba803')).toBe(true);
		expect(isValidGuid('41b2335c-40dd-480a-aad3-92e46431b615')).toBe(true);
	});

	it('should fail invalid guid', () => {
		expect(isValidGuid('foobar')).toBe(false);
		expect(isValidGuid('asdasd')).toBe(false);
		expect(isValidGuid('17709f4f-d5fd-431d-b2aa-e95069bba803420')).toBe(false);
	});
});
