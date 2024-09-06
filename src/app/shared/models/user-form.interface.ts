import { FormControl } from "@angular/forms";
import { Country } from "./country";

export interface IUserForm {
  country: FormControl<Country | null>;
  userName: FormControl<string | null>;
  birthday: FormControl<Date | null>;
}
