export class Game {
    id!: number;
    user!: String;  // Relación con el modelo de usuario
    score!: number;
    time!: number;
    difficulty!: 'Easy' | 'Half' | 'Difficult';  // Opciones disponibles para la dificultad
    played_at!: string;  // Asumimos que el formato de fecha es ISO (como string)
}
