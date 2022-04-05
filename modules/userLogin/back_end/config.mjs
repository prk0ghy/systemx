export default {
	mode: process.env.SYSTEMX_MODE,
	userLogin: {
		domain: process.env.USER_LOGIN_API_DOMAIN,
		port: process.env.USER_LOGIN_API_PORT,
		storagePath: process.env.USER_LOGIN_API_STORAGE_PATH,
		cookieName: process.env.USER_LOGIN_API_COOKIE_NAME,
		paypal: {
			clientId: process.env.USER_LOGIN_API_PAYPAL_CLIENT_ID,
			clientSecret: process.env.USER_LOGIN_API_CLIENT_SECRET
		}
	}
};
