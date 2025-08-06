class EceliaAPI {
    constructor(apiUrl = 'http://localhost:3000') {
        this.apiUrl = apiUrl;
        this.timeout = 15000; // 15 seconds timeout
    }

    async sendMessage(message) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);

            const response = await fetch(`${this.apiUrl}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message.trim() }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.response || "Sorry, I didn't get that. Try asking about E-Cell UCER! 😊";

        } catch (error) {
            console.error('API Error:', error);
            
            if (error.name === 'AbortError') {
                return "Request timed out. Please try again! 😊";
            }
            
            if (error.message.includes('Failed to fetch')) {
                return "I'm having trouble connecting to my brain 🧠. Please check your internet and try again! 😊";
            }
            
            return error.message || "Something went wrong. Please try again! 😊";
        }
    }

    async healthCheck() {
        try {
            const response = await fetch(`${this.apiUrl}/health`, {
                method: 'GET',
                timeout: 5000
            });
            return response.ok;
        } catch (error) {
            console.error('Health check failed:', error);
            return false;
        }
    }
}

// Make it globally available
window.EceliaAPI = EceliaAPI;