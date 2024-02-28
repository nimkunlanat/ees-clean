import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'x-etdt01-skill',
  templateUrl: './etdt01-skill.component.html',
  styleUrl: './etdt01-skill.component.scss'
})
export class Etdt01SkillComponent {

  constructor(
  private router: Router){

  }

  next(){
    this.router.navigateByUrl('/et/etdt01/assessment');
  }

  cancel(){
    this.router.navigateByUrl('et/etdt01');
  }
}



