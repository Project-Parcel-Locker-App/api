import 'dotenv/config';
import jwt, { Secret } from 'jsonwebtoken';

const signTokens = (payload: object) => {
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

const verifyToken = (token: string, secret: Secret): object => {
	const decoded = jwt.verify(token, secret) as object;
	return decoded;
}

export { signTokens, verifyToken };
