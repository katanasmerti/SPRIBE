import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserListComponent } from './feature-users-list/feature-users-list.component';

@Component({
  imports: [UserListComponent],
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
}
