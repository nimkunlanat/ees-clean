import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'x-etdt01',
  templateUrl: './etdt01.component.html',
  styleUrl: './etdt01.component.scss',

})
export class Etdt01Component {
  constructor(
  private router: Router){

  }

  createform(){
    this.router.navigateByUrl('et/etdt01/assessment');
  }
}
