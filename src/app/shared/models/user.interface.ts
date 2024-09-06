import { FormControl } from "@angular/forms";
import { Country } from "./country";

export interface IUser {
  country: Country | null;
  userName: string | null;
  birthday: Date | null;
  id: string;
}
