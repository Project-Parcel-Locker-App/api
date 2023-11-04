"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cabinetController_1 = require("../controllers/cabinetController");
const cabinetRouter = express_1.default.Router();
cabinetRouter.get('/:cabinetID', cabinetController_1.getCabinetStatus);
cabinetRouter.put('/:cabinetID/reserve', cabinetController_1.reserveCabinet);
exports.default = cabinetRouter;
