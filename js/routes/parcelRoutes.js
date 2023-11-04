"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const parcelController_1 = require("../controllers/parcelController");
const parcelRouter = express_1.default.Router();
parcelRouter.post('/send', parcelController_1.sendParcel);
parcelRouter.get('/:parcelID', parcelController_1.getParcelInfo);
parcelRouter.put('/:parcelID/update', parcelController_1.updateParcelStatus);
exports.default = parcelRouter;
