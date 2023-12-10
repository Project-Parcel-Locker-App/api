import 'dotenv/config';
import jwt, { Secret } from 'jsonwebtoken';

const signTokens = (payload: User) => {
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

const verifyToken = (token: string, secret: Secret): User => {
	const decoded: User = jwt.verify(token, secret);
	return decoded;
}

export { signTokens, verifyToken };
