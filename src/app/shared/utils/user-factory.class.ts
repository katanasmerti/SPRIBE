import { Country } from "../models/country";
import { IUser } from "../models/user.interface";

export class UserFactory {
  public static createUser(country: Country | null = null, userName: string | null = null, birthday: Date | null = null): IUser {
    return {
      country: country,
      userName: userName,
      birthday: birthday,
      id: crypto.randomUUID(),
    };
  }
}
