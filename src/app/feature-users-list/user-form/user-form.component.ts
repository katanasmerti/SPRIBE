import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [NgFor, NgIf],
  selector: 'user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormComponent {}
