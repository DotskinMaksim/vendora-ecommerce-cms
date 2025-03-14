/**
 * DTO, который мы используем на /api/register.
 * Описывает структуру данных { email, username, password }.
 */
export interface RegisterDto {
    email: string;
    username: string;
    password: string;
}