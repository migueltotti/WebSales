import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private jwtHelper = new JwtHelperService();

  constructor() {}

  getToken(): string | null {
    if(typeof localStorage !== "undefined"){
      return localStorage.getItem('jwt');
    }
    
    return null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  isEmployeeOrAdmin(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const decodedToken = this.jwtHelper.decodeToken(token);
    return decodedToken?.role === 'Employee' || decodedToken?.role === 'Admin';
  }

  isAdmin(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const decodedToken = this.jwtHelper.decodeToken(token);
    return decodedToken?.role === 'Admin';
  }
}
