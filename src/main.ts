/// <reference types="@angular/localize" />

import { customBootstrapApplication } from "./custom-bootstrap-application.function";

void (function bootstrapApp(): void {
  try {
    customBootstrapApplication().catch(err => console.error(err));
  } catch (err) {
    console.error('environment.json NOT loaded', err);
  }
})();
