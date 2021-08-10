export const formatPrice = price => `${price.toFixed(2)}\u{202f}€`.replace(".", ",");
