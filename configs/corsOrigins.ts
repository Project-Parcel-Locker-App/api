import 'dotenv/config';

const ACCEPTED_ORIGINS: string[] = [
	process.env.CONSUMER_APP_URL?.toString(),
	process.env.DRIVER_APP_URL?.toString(),
	process.env.LOCKER_APP_URL?.toString(),
].filter(Boolean) as string[];

export { ACCEPTED_ORIGINS };
