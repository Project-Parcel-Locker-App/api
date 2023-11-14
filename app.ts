import express, { Request, Response, Application } from 'express';
import cors from 'cors';
import userRouter from './routes/userRoutes';
import parcelRouter from './routes/parcelRoutes';
import cabinetRouter from './routes/cabinetRoutes';

const app: Application = express();
app.use([
	cors(),
	express.json(), // for parsing application/json
	express.urlencoded({ extended: false }), // for parsing application/x-www-form-urlencoded
]);

app.get('/', (_req: Request, res: Response) => {
	res.send('Welcome to Express TypeScript Server.');
});

// Middleware setup, if needed
// app.use(yourMiddleware);

// Route setup
app.use('/users', userRouter);
app.use('/parcels', parcelRouter);
app.use('/cabinets', cabinetRouter);
app.use((_req: Request, res: Response) => {
	res.status(404).json({ error: 'Not Found' });
}
);

// Eve's testing
// Serve static files
app.use(express.static('testing')); // directory contains your HTML files
app.post('/login', (_req, res) => {
	res.sendFile(__dirname + '/testing/login.html');
}
);
app.get('/parcels/history', (_req, res) => {
	res.sendFile(__dirname + '/testing/parcelhistory.html');
}
);
app.put('/users/userprofile', (_req, res) => {
	res.sendFile(__dirname + '/testing/userprofile.html');
}
);
app.post('/parcels/send', (_req, res) => {
	res.sendFile(__dirname + '/testing/sendparcel.html');
}
);

  



// cabinetRoutes.ts
/*const router = express.Router();

router.put('/updatestatus', CabinetController.updateStatus);
router.put('/reserve', CabinetController.reserveCabinet);*/

export default app;




// Start the server
const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
