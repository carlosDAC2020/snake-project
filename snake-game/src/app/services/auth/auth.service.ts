import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private apiUrl = 'http://localhost:4200/auth';
  private tokenKey = 'token';

  constructor(private http: HttpClient) { }

  login(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login/`, { 
      username: user.username, 
      password: user.password 
    });
  }

  registerUser(newUser: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/`, {
      username: newUser.username,
      password: newUser.password,
      email: newUser.email,
      first_name: newUser.first_name,
      last_name: newUser.last_name
    });
  }

  getUserProfile(): Observable<any> {
    const url = `${this.apiUrl}/profile/`; // Asegúrate de que la URL coincida con tu endpoint
    const headers = new HttpHeaders({
      'Authorization': `Token ${this.getToken()}`, // Se pasa el token de autenticación en los headers
      'Content-Type': 'application/json'
    });
  
    return this.http.post(url, {}, { headers }); 
  }

  editData(updatedUser: { username?: string; password?: string }): Observable<any> {
    const url = `${this.apiUrl}/update-profile/`; // Asegúrate de que la URL coincide con tu endpoint
    const headers = new HttpHeaders({
      'Authorization': `Token ${this.getToken()}`, // Se pasa el token de autenticación en los headers
      'Content-Type': 'application/json'
    });
  
    return this.http.post(url, updatedUser, { headers });
  }
  
  deleteAccount(): Observable<any> {
    const url = `${this.apiUrl}/delete-user/`; // Asegúrate de que esta URL sea correcta
    const headers = new HttpHeaders({
        'Authorization': `Token ${this.getToken()}`, // Se pasa el token de autenticación en los headers
        'Content-Type': 'application/json'
    });
  
    return this.http.delete(url, { headers });
}

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }
  
}
