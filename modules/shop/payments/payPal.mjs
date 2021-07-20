import { getFees } from "./payPalFees.mjs";
console.log(getFees(0.01, "EUR", "DE"));
const makeAmount = (value, currencyCode = "EUR") => ({
	currency_code: currencyCode,
	value: String(value.toFixed(2))
});
const makeItem = (product, sku) => ({
	category: "DIGITAL_GOODS",
	name: product.name,
	quantity: String(product.amount),
	sku,
	tax: product.tax || makeAmount(0),
	unit_amount: makeAmount(product.price)
});
const checkAmountCompatibility = (amountA, amountB) => {
	if (amountA.currency_code !== amountB.currency_code) {
		throw new Error("Incompatible amounts");
	}
};
const addAmount = (amountA, amountB) => {
	checkAmountCompatibility(amountA, amountB);
	return makeAmount(Number(amountA.value) + Number(amountB.value), amountA.currency_code);
};
const subtractAmount = (amountA, amountB) => {
	checkAmountCompatibility(amountA, amountB);
	return makeAmount(Number(amountA.value) - Number(amountB.value), amountA.currency_code);
};
const multiplyAmount = (amount, factor) => makeAmount(Number(amount.value * factor), amount.currency_code);
const getItemTotal = items => items
	.map(item => multiplyAmount(item.unit_amount, item.quantity))
	.reduce(addAmount);
const getTaxTotal = items => items
	.map(item => multiplyAmount(item.tax, item.quantity))
	.reduce(addAmount);
const getPurchaseUnitTotal = (items, discount = 0) => subtractAmount(
	addAmount(
		getItemTotal(items),
		getTaxTotal(items)
	),
	makeAmount(discount)
);
export const makeOrderData = cart => {
	const { discount = 0 } = cart;
	const items = Object.entries(cart)
		.map(([sku, product]) => makeItem(product, String(sku)));
	const date = Intl.DateTimeFormat("de-DE", {
		day: "numeric",
		month: "long",
		year: "numeric"
	}).format(new Date());
	return {
		intent: "CAPTURE",
		purchase_units: [{
			amount: {
				...getPurchaseUnitTotal(items, discount),
				breakdown: {
					discount: makeAmount(discount),
					item_total: getItemTotal(items),
					tax_total: getTaxTotal(items)
				}
			},
			description: `Ihr Einkauf vom ${date}`,
			items
		}]
	};
};
