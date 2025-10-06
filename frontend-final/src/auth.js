import apiClient from './apiClient';
import { navigateTo } from './utils/navigation';

export async function handleLogin(email, password) {
    try {
        const response = await apiClient.post('/auth/login', { email, password });
        localStorage.setItem('token', response.data.token);
        
        // After login, check user role and redirect
        const user = getUser();
        if (user.role === 'teacher') {
            navigateTo('/teacher-dashboard');
        } else if (user.role === 'admin') {
            navigateTo('/admin');
        } else {
            navigateTo('/dashboard');
        }

        // Dispatch a custom event to notify other parts of the app (like the navbar)
        window.dispatchEvent(new CustomEvent('auth-change'));
    } catch (error) {
        console.error('Login failed:', error);
        alert('Login failed. Please check your credentials.');
    }
}

export async function handleRegister(name, email, password, role) {
    try {
        const response = await apiClient.post('/auth/register', { name, email, password, role });
        localStorage.setItem('token', response.data.token);

        // After registration, check user role and redirect
        if (role === 'teacher') {
            navigateTo('/teacher-dashboard');
        } else {
            navigateTo('/dashboard');
        }

        // Dispatch the auth-change event
        window.dispatchEvent(new CustomEvent('auth-change'));
    } catch (error) {
        console.error('Registration failed:', error);
        alert('Registration failed. Please try again.');
    }
}

export function handleLogout() {
    localStorage.removeItem('token');
    navigateTo('/login');
    // Dispatch the auth-change event
    window.dispatchEvent(new CustomEvent('auth-change'));
}

export function getUser() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        // Decode the token payload (the middle part of the JWT)
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.user;
    } catch (error) {
        console.error('Failed to decode token:', error);
        return null;
    }
}

