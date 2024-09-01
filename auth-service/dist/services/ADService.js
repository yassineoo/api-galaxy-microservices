"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("../models/userModel"));
class ADService {
}
_a = ADService;
ADService.deactivateAccount = (id) => __awaiter(void 0, void 0, void 0, function* () {
    //we will manage the permissions here
    userModel_1.default.updateUser(id, { IsActive: false });
});
ADService.activateAccount = (id) => __awaiter(void 0, void 0, void 0, function* () {
    userModel_1.default.updateUser(id, { IsActive: true });
});
exports.default = ADService;
