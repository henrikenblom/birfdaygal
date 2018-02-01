import {Component} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  activeLink = '';
  constructor(private router: Router,
              private route: ActivatedRoute) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.activeLink = route.root.firstChild.snapshot.data['active-link'];
      }
    });
  }
}
