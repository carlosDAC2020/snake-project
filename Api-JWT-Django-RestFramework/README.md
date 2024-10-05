# Api-Auth-Jwt
Api que usa un sistema de aiutnetificacion usando JWT para login de usuarios y acceso a rutas protegidas para el manejo de datos de dicho usuario.
![Auth](/caps/estruct.PNG)


## Endpoints

### Autenticación y Registro de Usuarios

- **Login:** `POST /login/`
  - Permite a un usuario autenticarse.
  - **Body:** `{"username": "example_username", "password": "example_password"}`
  
- **Registro:** `POST /register/`
  - Permite a un usuario registrarse.
  - **Body:** `{"username": "new_username", "password": "new_password", "email": "new_user@example.com", "first_name": "First", "last_name": "Last"}`

### Perfil de Usuario

- **Obtener Perfil:** `POST /profile/`
  - Obtiene el perfil del usuario autenticado.
  - **Authorization:** Token {your_token_here}

### Tareas

- **Obtener Lista de Tareas:** `GET /tasks/`
  - Obtiene la lista de tareas del usuario autenticado.
  - **Authorization:** Token {your_token_here}

- **Crear Tarea:** `POST /create_task/`
  - Crea una nueva tarea para el usuario autenticado.
  - **Authorization:** Token {your_token_here}
  - **Body:** `{"title": "Task Title", "description": "Task Description", "status": "Pendiente"}`

- **Obtener Tarea por ID:** `GET /get_task/{task_id}/`
  - Obtiene una tarea específica por su ID.
  - **Authorization:** Token {your_token_here}

- **Actualizar Tarea por ID:** `PUT /update_task/{task_id}/`
  - Actualiza una tarea específica por su ID.
  - **Authorization:** Token {your_token_here}
  - **Body:** `{"title": "Updated Task Title", "description": "Updated Task Description", "status": "En progreso"}`

- **Eliminar Tarea por ID:** `DELETE /delete_task/{task_id}/`
  - Elimina una tarea específica por su ID.
  - **Authorization:** Token {your_token_here}

## Ejemplos

Puedes utilizar herramientas como Postman o Curl para probar los endpoints de la API. A continuación, se muestran algunos ejemplos de uso:

```http
POST /login/
Content-Type: application/json

{
  "username": "example_username",
  "password": "example_password"
}


POST /register/
Content-Type: application/json

{
  "username": "new_username",
  "password": "new_password",
  "email": "new_user@example.com",
  "first_name": "First",
  "last_name": "Last"
}

GET /tasks/
Authorization: Token {your_token_here}
```

## IC
se usa Github actions para la integracion continua siguiendo los siguientes pasoso 

- tener la aplicacion ya lista 
- escribir el dokerfile correspondiente para generar la imagen de la aplicacion, en el caso de este repo se hace uno especialmente para una aplicacion de django. tener el .dockerignore para cuando se suba la imagen.
- teniendo lo anterior listo iremos a la seccion actions de nuestro repo en github 
![Auth](/caps/actions%20init.PNG)
Hay varias configuiracion segun el tipo de aplicacion pero usaremos el generico q es Manual workflow
- Al dar en configurar se nos genera una carpeta que tiene nuestro archivo manual.yml el cual editamos de la siguiente ,anera
![Auth](/caps/manual.PNG)
lo q se hace es describir los comandos que debe seguirse para publicar nuestra imagen en docker hub-
- pero para q esto funcione se agregar un token de acceso de docker hub el cual podemos generar en neustra cuenta de docker hub
![Auth](/caps/tocken%20docker.PNG)
guardamos el valor del tocken en alguna parte 
- agregamos nuestro token a los secrets de nuestro repo
![Auth](/caps/secret.PNG)
- finalmente al hacer cualquier cambio en nuestro codigo y hacer un commit nuestri pypline para desplegar nuestra imagen se ejecutara 
![Auth](/caps/ejecucion.PNG)
- ya podriamos ver nuestra imagen en nuestro repo de docker hub 
![Auth](/caps/image%20in%20docker.PNG)