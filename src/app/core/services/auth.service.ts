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
  private rolesSubject = new BehaviorSubject<string[]>([]);
  roles$ = this.rolesSubject.asObservable();
  private activeRoleSubject = new BehaviorSubject<string>('');
  activeRole$ = this.activeRoleSubject.asObservable();

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
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
        this.setRoles(user.roles); // Ensure roles are set on init
      }
      // Optionally, load roles and activeRole from localStorage/sessionStorage
      const storedRoles = localStorage.getItem('roles');
      const storedActiveRole = localStorage.getItem('activeRole');
      if (storedRoles) this.rolesSubject.next(JSON.parse(storedRoles));
      if (storedActiveRole) this.activeRoleSubject.next(storedActiveRole);
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
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
        this.currentUserSubject.next(user);
        this.setRoles(user.roles); // Ensure roles are set after login
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
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
        this.currentUserSubject.next(user);
        this.setRoles(user.roles); // Ensure roles are set after register
      })
    );
  }

  logout(): void {
    try {
      if (isPlatformBrowser(this.platformId)) {
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

  setRoles(roles: string[]) {
    this.rolesSubject.next(roles);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('roles', JSON.stringify(roles));
    }
  }

  setActiveRole(role: string) {
    // Capitalize first letter for backend
    const formattedRole = role.charAt(0).toUpperCase() + role.slice(1);
    this.http.patch(`${environment.apiUrl}/users/me/active-role`, { activeRole: formattedRole }).subscribe({
      next: () => {
        this.activeRoleSubject.next(role);
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('activeRole', role);
        }
      }
    });
  }

  assignContractorRole() {
    return this.http.patch<any>(`${environment.apiUrl}/auth/assign-role`, { isClient: true, isContractor: true }).pipe(
      tap(res => {
        // Update user and roles with new token and roles from response
        const user = this.getCurrentUser();
        if (user && res.token && res.user) {
          user.token = res.token;
          // Update roles based on response
          user.roles = [];
          if (res.user.isClient) user.roles.push('client');
          if (res.user.isContractor) user.roles.push('contractor');
          this.currentUserSubject.next(user);
          this.setRoles(user.roles);
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('currentUser', JSON.stringify(user));
          }
        }
      })
    );
  }
} 