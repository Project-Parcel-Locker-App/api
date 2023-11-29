import { Request, Response } from 'express';

const handle404Error = (_req: Request, res: Response) => {
	res.status(404).json({
		error: 'Not Found',
		message: 'The requested resource could not be found.',
		suggestedAction: 'Check the API documentation for valid endpoints.',
	});
};

export { handle404Error };
