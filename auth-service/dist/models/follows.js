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
const userModel_1 = __importDefault(require("./userModel"));
const currentDate = new Date();
class followsModel {
}
_a = followsModel;
followsModel.followUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, followingId } = data;
    const user = yield userModel_1.default.getUserById(userId);
    if (!user || userId === followingId) {
        throw new Error("User not found !");
    }
    try {
        /*  const follow = await prismaClientSingleton.follows.create({
                  data: {
                      users_follows_FollowerIDTousers: {
                          connect: { UserID: followingId },
                      },
                      users_follows_FollowingIDTousers: {
                          connect: { UserID: userId },
                      },
                  },
              });
  */
        // console.log("Follow relation created: ", follow);
    }
    catch (error) {
        console.error("Error creating follow relation: ", error);
    }
});
followsModel.removeFollow = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return 0;
});
exports.default = followsModel;
