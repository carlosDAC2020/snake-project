import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from "@angular/forms";
import { Router } from '@angular/router';

// srvicio de autenticacion 
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-authn',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './authn.component.html',
  styleUrl: './authn.component.css'
})
export class AuthnComponent {

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  // propiedades 
  auth:any={ // cabecera de autenticacion y registro de usuarios
    "username": "",
    "password": "",
    "email": "",
    "first_name": "",
    "last_name": ""
  };
  rep_password:string="";

  error_message :string = "";
  authType:string="Login"

  login(){
    if(this.authType=="Login"){
      // uso del servicio para el login
    const user:any={
      "username": this.auth.username,
      "password": this.auth.password,
    }
    this.authService.login(user).subscribe(response => {
      if (response && response.token) {
        this.authService.setToken(response.token);
        this.router.navigate(['/Snake-Game/home']);
      }
    }, error => {
      console.log("algo salio mal ");
      console.log(error.status)
      this.error_message="invalid password or username";
    });
    }
    else{
      this.authType="Login"
    }
  }
  register() {
    if (this.authType == "Register") {
      // Verificar que el usuario y la contraseña tengan al menos 6 caracteres
      if (!this.auth.username || this.auth.username.length < 6) {
        alert("El nombre de usuario debe tener al menos 6 caracteres.");
        return; // Detener la ejecución si la validación falla
      }
  
      if (!this.auth.password || this.auth.password.length < 6) {
        alert("La contraseña debe tener al menos 6 caracteres.");
        return; // Detener la ejecución si la validación falla
      }
  
      alert("Registrando usuario...");
      // Lógica del servicio para el registro y el login
      this.authService.registerUser(this.auth).subscribe(response => {
        if (response && response.token) {
          this.authService.setToken(response.token);
          this.router.navigate(['/Snake-Game/home']);
        }
      }, error => {
        console.error('Error de registro', error);
        alert("Ocurrió un error al registrar el usuario."); // Mensaje de error en caso de falla
      });
    } else {
      this.authType = "Register";
    }
  }  

}
