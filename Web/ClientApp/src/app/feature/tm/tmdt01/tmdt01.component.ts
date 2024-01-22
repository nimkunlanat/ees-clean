import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';

@Component({
  selector: 'x-tmdt01',
  templateUrl: './tmdt01.component.html',
  styleUrl: './tmdt01.component.scss',
})
export class Tmdt01Component implements OnInit {
  data: TreeNode[] = [];

  isDrag;
  constructor() {}

  ngOnInit(): void {}

  dragStart(data) {
    this.isDrag = data
  }

  drop(){
    this.data.unshift(this.isDrag)
  }
}
