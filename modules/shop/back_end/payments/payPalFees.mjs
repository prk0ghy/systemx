const getFixedCharge = receivedCurrencyCode => new Map([
	["AUD", 0.30],
	["BRL", 0.60],
	["CAD", 0.30],
	["CZK", 10.00],
	["DKK", 2.60],
	["EUR", 0.35],
	["HKD", 2.35],
	["HUF", 90.00],
	["ILS", 1.20],
	["JPY", 40.00],
	["MYR", 2.00],
	["MXN", 4.00],
	["TWD", 10.00],
	["NZD", 0.45],
	["NOK", 2.80],
	["PHP", 15.00],
	["PLN", 1.35],
	["RUB", 10.00],
	["SGD", 0.50],
	["SEK", 3.25],
	["CHF", 0.55],
	["THB", 11.00],
	["GBP", 0.20],
	["USD", 0.30]
]).get(receivedCurrencyCode) || NaN;
const variableRateIncreaseZones = new Map([
	/* Domestic */
	[[
		/* Germany */
		"DE"
	], 0],
	/* North America */
	[[
		/* Canada */
		"CA",
		/* United States of America */
		"US"
	], 0.02],
	/* Europe I, without Channel Islands */
	[[
		/* Austria */
		"AT",
		/* Belgium */
		"BE",
		/* Cyprus */
		"CY",
		/* Estonia */
		"EE",
		/* France */
		"FR",
		/* French Guyana */
		"GY",
		/* Guadeloupe */
		"GP",
		/* Martinique */
		"MQ",
		/* Réunion */
		"RE",
		/* Mayotte */
		"YT",
		/* Gibraltar */
		"GI",
		/* Greece */
		"GR",
		/* Ireland */
		"IE",
		/* Isle of Man */
		"IM",
		/* Italy */
		"IT",
		/* Luxembourg */
		"LU",
		/* Malta */
		"MT",
		/* Monaco */
		"MC",
		/* Montenegro */
		"ME",
		/* Netherlands */
		"NL",
		/* Portugal */
		"PT",
		/* San Marino */
		"SM",
		/* Slovakia */
		"SK",
		/* Slovenia */
		"SI",
		/* Spain */
		"ES",
		/* United Kingdom */
		"GB",
		/* Holy See */
		"VA"
	], 0.02],
	/* Europe II */
	[[
		/* Albania */
		"AL",
		/* Andorra */
		"AD",
		/* Belarus */
		"BY",
		/* Bosnia and Herzegovina */
		"BA",
		/* Bulgaria */
		"BG",
		/* Croatia */
		"HR",
		/* Czech Republic */
		"CZ",
		/* Georgia */
		"GE",
		/* Hungary */
		"HU",
		/* Kosovo */
		"XK",
		/* Latvia */
		"LV",
		/* Liechtenstein */
		"LI",
		/* Lithuania */
		"LT",
		/* Republic of Macedonia */
		"MK",
		/* Moldova */
		"MD",
		/* Poland */
		"PL",
		/* Romania */
		"RO",
		/* Russian Federation */
		"RU",
		/* Serbia */
		"RS",
		/* Switzerland */
		"CH",
		/* Ukraine */
		"UA"
	], 0.03],
	/* Northern Europe */
	[[
		/* Aland Islands */
		"AX",
		/* Denmark */
		"DK",
		/* Faroe Islands */
		"FO",
		/* Finland */
		"FI",
		/* Greenland */
		"GL",
		/* Iceland */
		"IS",
		/* Norway */
		"NO",
		/* Sweden */
		"SE"
	], 0.018]
]);
const getVariableRateIncrease = senderCountryCode => {
	const fallbackRate = 0.033;
	for (const [countryCodes, rateIncrease] of variableRateIncreaseZones) {
		if (countryCodes.includes(senderCountryCode)) {
			return rateIncrease;
		}
	}
	return fallbackRate;
};
const getVariableRate = senderCountryCode => {
	const baseRate = 0.0249;
	return baseRate + getVariableRateIncrease(senderCountryCode);
};
/*
* Computes fees, assuming a German PayPal merchant, as of 2021-07-20.
* See https://www.paypal.com/de/webapps/mpp/merchant-fees
*/
export const getFees = (receivedAmount, receivedCurrencyCode, senderCountryCode) => {
	const fixedCharge = getFixedCharge(receivedCurrencyCode);
	const variableCharge = receivedAmount * getVariableRate(senderCountryCode);
	return fixedCharge + variableCharge;
};
