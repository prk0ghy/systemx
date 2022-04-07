export default {
	mode: process.env.SYSTEMX_MODE ?? "development",
	userLogin: {
		domain: process.env.USER_LOGIN_API_DOMAIN ?? "http://localhost:3000",
		port: process.env.USER_LOGIN_API_PORT ?? 3000,
		storagePath: process.env.USER_LOGIN_API_STORAGE_PATH ?? "./.sqlite",
		cookieName: process.env.USER_LOGIN_API_COOKIE_NAME ?? "Portal_Session_Token",
		paypal: {
			clientId: process.env.USER_LOGIN_API_PAYPAL_CLIENT_ID ?? "",
			clientSecret: process.env.USER_LOGIN_API_PAYPAL_CLIENT_SECRET ?? ""
		},
		mounts: {
			baseDir: process.env.USER_LOGIN_API_MOUNT_BASE_DIR ?? "/var/www/html",
			targets: JSON.parse(process.env.USER_LOGIN_API_MOUNTS ?? "[]")
		}
	}
};
