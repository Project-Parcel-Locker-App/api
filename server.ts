import 'dotenv/config';
import { app } from './app.js';

const PORT = Number(process.env.PORT ?? 3000);

// Start the server
app.listen(PORT, () => {
	console.log(`Server is listening on http://localhost:${PORT}/api`);
});
