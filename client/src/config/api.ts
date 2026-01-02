// API configuration
const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
export const API_URL = rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;

// Helper function to make API calls
export const api = {
    get: async (endpoint: string) => {
        const response = await fetch(`${API_URL}${endpoint}`);
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        return response.json();
    },
    post: async (endpoint: string, data: any) => {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        return response.json();
    }
};
