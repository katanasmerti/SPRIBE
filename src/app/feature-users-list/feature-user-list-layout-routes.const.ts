import {Routes} from '@angular/router';

export const FEATURE_USER_LIST_LAYOUT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./feature-users-list.component').then(m => m.UserListComponent),
  },
];
