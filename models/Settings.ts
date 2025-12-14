import  { Schema, model, models } from "mongoose";

interface ISettings {
  companyName: string;
  supportEmail: string;
}

const SettingsSchema = new Schema<ISettings>({
  companyName: { type: String, required: true },
  supportEmail: { type: String, required: true },
});

const Settings =
  models.Settings || model<ISettings>("Settings", SettingsSchema);
export default Settings;
