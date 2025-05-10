import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { User, LoginDto, RegisterDto } from '../models/auth.models';
import { isPlatformBrowser } from '@angular/common';

function decodeJwt(token: string): any {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return {};
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private platformId: Object;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.platformId = platformId;
    // Check for stored user on service initialization
    if (isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        this.currentUserSubject.next(JSON.parse(storedUser));
      }
    }
  }

  login(loginData: LoginDto): Observable<User> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, loginData, { headers }).pipe(
      map(res => {
        const decoded = decodeJwt(res.token);
        const roles = [
          decoded.isClient === 'True' || decoded.isClient === true ? 'client' : null,
          decoded.isContractor === 'True' || decoded.isContractor === true ? 'contractor' : null
        ].filter((r): r is string => !!r);
        const activeRole = decoded.isContractor === 'True' || decoded.isContractor === true
          ? 'contractor'
          : (decoded.isClient === 'True' || decoded.isClient === true ? 'client' : '');
        const user: User = {
          id: decoded.sub || '',
          email: decoded.email || '',
          roles,
          activeRole,
          token: res.token
        };
        return user;
      }),
      tap(user => {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
        this.currentUserSubject.next(user);
      })
    );
  }

  register(registerData: RegisterDto): Observable<User> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<{ token: string }>(`${this.apiUrl}/register`, registerData, { headers }).pipe(
      map(res => {
        const decoded = decodeJwt(res.token);
        const roles = [
          decoded.isClient === 'True' || decoded.isClient === true ? 'client' : null,
          decoded.isContractor === 'True' || decoded.isContractor === true ? 'contractor' : null
        ].filter((r): r is string => !!r);
        const activeRole = decoded.isContractor === 'True' || decoded.isContractor === true
          ? 'contractor'
          : (decoded.isClient === 'True' || decoded.isClient === true ? 'client' : '');
        const user: User = {
          id: decoded.sub || '',
          email: decoded.email || '',
          roles,
          activeRole,
          token: res.token
        };
        return user;
      }),
      tap(user => {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
        this.currentUserSubject.next(user);
      })
    );
  }

  logout(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('currentUser');
        // Optionally clear all localStorage if you want:
        // localStorage.clear();
      }
    } catch (e) {
      // Ignore errors
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user?.activeRole === role;
  }

  getToken(): string | null {
    const user = this.getCurrentUser();
    return user ? user.token : null;
  }
} 