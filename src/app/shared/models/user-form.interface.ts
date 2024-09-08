import { FormControl } from "@angular/forms";
import { Country } from "./country.enum";

export interface IUserForm {
  country: FormControl<Country | null>;
  userName: FormControl<string | null>;
  birthday: FormControl<Date | null>;
  // Used for track by function to prevent unnecessary render operations.
  internalId: FormControl<string>;
}
