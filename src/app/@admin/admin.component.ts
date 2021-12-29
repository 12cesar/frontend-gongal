import { Component, OnInit } from '@angular/core';
import { Event, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  page:string='Dashboard'
  constructor(private router: Router) { 
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
          // Show loading indicator
           const url= event.url;
           if (url === '/admin') {
             this.page = 'Dashboard'
           }else{
            
            const url2 = url.slice(7);
            const may = url2.charAt(0).toUpperCase();
            this.page = may.toUpperCase()+url2.slice(1);
            
            
           }
           
      }

      if (event instanceof NavigationEnd) {
          // Hide loading indicator
      }

      if (event instanceof NavigationError) {
          // Hide loading indicator

          // Present error to user
          console.log(event.error);
      }
  });
  }

  ngOnInit(): void {
  }

}
