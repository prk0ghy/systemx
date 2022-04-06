import dotenv from 'dotenv';
dotenv.config();
interface ILogTrackingConfig {
	storagePath: string
	port: number
	target: string
}
const config: ILogTrackingConfig = {
	storagePath: process.env.USER_TRACKING_STORAGE_PATH ?? '././sqlite',
	port: process.env.USER_TRACKING_PORT ? parseInt(process.env.USER_TRACKING_PORT, 10) : 1234,
	target: process.env.USER_TRACKING_TARGET ?? 'lasub',
};
export default config;
