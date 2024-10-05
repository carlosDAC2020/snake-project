import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private apiUrl = 'http://localhost:8000/auth/'; 

  constructor(private http: HttpClient) { }

  // Método para obtener todos los juegos
  getGames(): Observable<any> {
    const url = `${this.apiUrl}games/`;
    return this.http.get(url);
  }

  // Método para guardar una partida
  saveGame(gameData: any, token: string): Observable<any> {
    const url = `${this.apiUrl}save-games/`;
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`, // Se pasa el token de autenticación en los headers
      'Content-Type': 'application/json'
    });

    return this.http.post(url, gameData, { headers });
  }

  // Método para obtener las partidas de un jugador específico
  getUserGames(token: string): Observable<any> {
    const url = `${this.apiUrl}my-games/`; // Asegúrate de que la URL coincida con tu endpoint
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`, // Se pasa el token de autenticación en los headers
      'Content-Type': 'application/json'
    });

    return this.http.get(url, { headers });
  }
}
