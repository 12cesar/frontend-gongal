import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

 
        showMenu() {
          const navLinks = document.getElementById("navLinks");
            navLinks!.style.right = "0";
        }
        hideMenu() {
          const navLinks = document.getElementById("navLinks");
            navLinks!.style.right = "-200px";
        }
}
