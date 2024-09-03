import APIModel from "../models/ApiModel";
import SettingsModel from "../models/SettingsModel";
import userModel from "../models/userModel";

export default class AdminService {
  static async updateTermsAndConditions(
    termsAndConditions: string,
    adminId: number
  ) {
    try {
      const res = await SettingsModel.updateTermsAndConditions(
        termsAndConditions,
        adminId
      );
      return res;
    } catch (error) {
      throw error;
    }
  }

  static async getUserList() {
    try {
      const res = await userModel.getAllUsers();
      return res;
    } catch (error) {
      throw error;
    }
  }

  static async updatePolicyAndPrivacy(poPr: string, adminId: number) {
    try {
      const res = await SettingsModel.updatePolicyAndPrivacy(poPr, adminId);
      return res;
    } catch (error) {
      throw error;
    }
  }

  static async publishAnAPI(api_id: number) {
    try {
      // change its status to active
      const api = await APIModel.updateAPI(api_id, {
        status: "active",
      });
      return api;
    } catch (error) {
      throw error;
    }
  }

  static async getInactiveAPIS() {
    try {
      const res = await APIModel.getInactiveAPIS();
      return res;
    } catch (error) {
      throw error;
    }
  }

  static async getAdminSettings() {
    try {
      const settings = await APIModel.getSettings();
      return settings;
    } catch (error) {
      throw error;
    }
  }
}
