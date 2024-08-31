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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TryCatch;
function TryCatch(cb) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield cb();
        }
        catch (error) {
            console.error("Error in isUserExist:", error);
            if (error instanceof Error)
                throw error;
            if (typeof error === 'string')
                throw new Error(error);
            if (error && typeof error === "object" && "message" in error && typeof error.message === "string")
                throw new Error(error.message);
            throw new Error("Internal Server Error");
        }
    });
}
