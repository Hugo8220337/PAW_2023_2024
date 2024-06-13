import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../../models/user.model';
import { Entity } from '../../../models/entity.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
  @Input() user: User = {} as User;
  @Input() entity: Entity = {} as Entity;


  constructor(public router: Router){}
}
