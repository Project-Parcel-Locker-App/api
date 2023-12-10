import 'dotenv/config';
import jwt, { Secret } from 'jsonwebtoken';
import { User } from '../schemas/user.js';

const signTokens = (payload: Partial<User>) => {
	const accessToken = jwt.sign(
		payload,
		process.env.ACCESS_TOKEN_SECRET as Secret,
		{	expiresIn: process.env.ACCESS_TOKEN_TIMESPAN},
	);
	const refreshToken = jwt.sign(
		payload,
		process.env.REFRESH_TOKEN_SECRET as Secret,
		{ expiresIn: process.env.REFRESH_TOKEN_TIMESPAN },
	);
	return { accessToken, refreshToken };
};

const verifyToken = (token: string, secret: Secret) => {
	const decoded = jwt.verify(token, secret);
	return decoded;
}

export { signTokens, verifyToken };
