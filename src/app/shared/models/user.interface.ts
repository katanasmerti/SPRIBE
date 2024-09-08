import { Country } from "./country.enum";

export interface IUser {
  country: Country | null;
  userName: string | null;
  birthday: Date | null;
  // Used for track by function to prevent unnecessary render operations.
  internalId: string;
}
