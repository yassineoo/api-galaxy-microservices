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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
class otpModel {
}
_a = otpModel;
otpModel.addOtp = (userId, otp) => __awaiter(void 0, void 0, void 0, function* () {
    if (userId == null && otp == null) {
        throw Error("cannot create otp");
    }
    /*  const otpAdded = prismaClientSingleton.otp_entries.create({
            data: {
                otp_key: otp,
                user_id: userId.toString(),
            }
        })
            */
    //return otpAdded
    return null;
});
exports.default = otpModel;
