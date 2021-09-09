import PayPalSDK from "@paypal/checkout-server-sdk";
const environment = process.env.NODE_ENV === "production"
	? PayPalSDK.core.LiveEnvironment
	: PayPalSDK.core.SandboxEnvironment;
export default new PayPalSDK.core.PayPalHttpClient(new environment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET));
