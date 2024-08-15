import { prismaClientSingleton } from "../utils/prismaClient";

export default class otpModel {
  static addOtp = async (userId: number, otp: number) => {
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
  };
}
