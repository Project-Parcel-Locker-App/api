"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const parcelRoutes_1 = __importDefault(require("./routes/parcelRoutes"));
const cabinetRoutes_1 = __importDefault(require("./routes/cabinetRoutes"));
const app = (0, express_1.default)();
// Middleware setup, if needed
// app.use(yourMiddleware);
// Route setup
app.use('/api/users', userRoutes_1.default);
app.use('/api/parcels', parcelRoutes_1.default);
app.use('/api/cabinets', cabinetRoutes_1.default);
// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
