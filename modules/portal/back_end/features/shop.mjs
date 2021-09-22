import DB from "../database.mjs";
import * as User from "../user.mjs";
User; // Just so the linter won't complain, because we need the import for the initialization order

await (async () => {
	await DB.run(`
		CREATE TABLE IF NOT EXISTS ShopOrder (
			ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
			user INTEGER NOT NULL REFERENCES User(ID) ON DELETE CASCADE ON UPDATE CASCADE,
			email TEXT NOT NULL,
			priceTotal DECIMAL(8, 2) NOT NULL,
			priceTaxes DECIMAL(8, 2) NOT NULL,
			priceSubtotal DECIMAL(8, 2) NOT NULL
		);
	`);
	await DB.run(`
		CREATE TABLE IF NOT EXISTS ShopOrderItem (
			ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
			shopOrder INTEGER NOT NULL REFERENCES ShopOrder(ID) ON DELETE CASCADE ON UPDATE CASCADE,
			productID INTEGER NOT NULL,
			productAmount INTEGER DEFAULT 1,
			productSinglePrice DECIMAL(8, 2) NOT NULL
		);
	`);
})();
