import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private jwtHelper = new JwtHelperService();

  constructor() {}

  getToken(): string | null {
    if(typeof sessionStorage !== "undefined"){
      return sessionStorage.getItem('jwt');
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

  setUserEmailToStorage(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const decodedToken = this.jwtHelper.decodeToken(token);
    sessionStorage.setItem('email', decodedToken?.email);
    
    return true;
  }

  setUserIdToStorage(userId: number): boolean {
    const token = this.getToken();
    if (!token) return false;

    const userIdString = userId.toString();
    sessionStorage.setItem('userId', userIdString);
    
    return true;
  }

  getUserIdFromStorage(): number | null {
    const token = this.getToken();
    if (!token) return null;

    const userId = parseInt(sessionStorage.getItem('userId')!, 10);
    
    return userId;
  }
}
