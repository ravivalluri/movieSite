import { Component, HostListener, OnInit, ChangeDetectorRef, OnDestroy, ViewChild } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { AuthService } from './core/auth/auth.service';
import { StorageService } from './shared/service/storage/storage.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    mobileQuery: MediaQueryList;
    lang: string;
// tslint:disable-next-line: variable-name
    private _mobileQueryListener: () => void;
    @ViewChild('snav') snav: any;

    constructor(
        public authService: AuthService,
        changeDetectorRef: ChangeDetectorRef,
        media: MediaMatcher,
        private router: Router,
        private snackbar: MatSnackBar,
        private storageService: StorageService,
        public translateService: TranslateService,
    ) {
        this.mobileQuery = media.matchMedia('(max-width: 731px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
// tslint:disable-next-line: deprecation
        this.mobileQuery.addListener(this._mobileQueryListener);
        this.translateService.setDefaultLang('en-US');
    }

    ngOnInit() {
        this.lang = this.storageService.read('language');
        !this.lang ? this.storageService.save('language', 'en-US') : this.lang = this.lang;
        this.translateService.use(this.lang);
    }

    ngOnDestroy(): void {
// tslint:disable-next-line: deprecation
        this.mobileQuery.removeListener(this._mobileQueryListener);
      }

    @HostListener('window:scroll', ['$event']) scrollHandler(event) {
        const height = window.scrollY;
        const el = document.getElementById('btn-returnToTop');
        height >= 500 ? el.className = 'show' : el.className = 'hide';
    }

    scrollTop() {
        window.scrollTo({left: 0, top: 0, behavior: 'smooth'});
    }

    searchMovie(term: string) {
        term === '' ? this.router.navigate(['/movies/now-playing']) : this.router.navigate(['/movies/search', { term }]);
    }

    onSignOut() {
        this.authService.signOut();
        this.translateService.get('Error.Goodbye').subscribe(results => this.snackbar.open(results, '', { duration: 2000 }));
        this.router.navigate(['/movies/now-playing']);
    }

    closeSidenav() {
        if (this.mobileQuery.matches !== false) {
            this.snav.close();
        }
    }

}
