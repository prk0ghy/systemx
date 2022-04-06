import {DataSource} from 'typeorm';
import config from './config';
import fs from 'fs-extra';
import path from 'path';
import {TrackingEntry} from './model/TrackingEntry';

export const createDBConnection = async (): Promise<DataSource> => {
	if (!config.storagePath) {
		throw new Error('no storage path specified');
	}

	const storageFile = path.join(config.storagePath, 'tracking_data.sqlite');
	if (!fs.existsSync(config.storagePath)) {
		await fs.mkdir(config.storagePath);
	}

	const appDataSource = new DataSource({
		type: 'sqlite',
		database: storageFile,
		entities: [TrackingEntry],
		synchronize: true,
	});

	return appDataSource.initialize();
};
