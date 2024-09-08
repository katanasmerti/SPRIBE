import {Routes} from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./feature-users-list/feature-user-list-layout-routes.const').then(m => m.FEATURE_USER_LIST_LAYOUT_ROUTES),
  },
];
