// Session Manager Utility (TypeScript)

type ReduxStore = { dispatch: (action: any) => void } | null;

class SessionManager {
    private sessionTimeout: number; // ms
    private activityTimer: number | null;
    private sessionExpiryTimer: number | null;
    private isSessionActive: boolean;
    private store: ReduxStore;

    constructor() {
        this.sessionTimeout = 5 * 60 * 1000; // 5 minutes
        this.activityTimer = null;
        this.sessionExpiryTimer = null;
        this.isSessionActive = false;
        this.store = null;
    }

    // Set Redux store for dispatching actions
    setStore(store: ReduxStore) {
        this.store = store;
    }

    // Initialize session (persist across reloads)
    initSession() {
        this.isSessionActive = true;

        // Check if user is authenticated first
        const isAuth = localStorage.getItem('auth_isAuthenticated') === 'true';
        const userRaw = localStorage.getItem('auth_user');

        if (!isAuth || !userRaw) {
            // No auth data, don't start session
            return;
        }

        // If session is valid or no lastActivity exists, start session
        if (this.isSessionValid() || !localStorage.getItem('lastActivity')) {
            this.updateLastActivity(); // Set initial activity time
            this.startActivityTracking();
            this.startSessionTimer();
        } else {
            // Session expired, logout
            this.autoLogout();
        }
    }

    // Update last activity timestamp
    updateLastActivity() {
        try {
            localStorage.setItem('lastActivity', Date.now().toString());
        } catch { }
    }

    // Start tracking user activity
    private startActivityTracking() {
        // Only update lastActivity when real user interactions happen
        if (this.activityTimer) {
            window.clearInterval(this.activityTimer);
            this.activityTimer = null;
        }

        const activityEvents: Array<keyof DocumentEventMap> = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
        const handleActivity = () => this.updateLastActivity();
        activityEvents.forEach((event) => document.addEventListener(event, handleActivity, true));
    }

    // Start session timer for auto logout
    private startSessionTimer() {
        if (this.sessionExpiryTimer) window.clearTimeout(this.sessionExpiryTimer);
        this.sessionExpiryTimer = window.setInterval(() => {
            if (!this.isSessionValid()) this.autoLogout();
        }, 10000) as unknown as number; // check every 10s for more responsive logout
    }

    // Auto logout when session expires
    private autoLogout() {
        if (!this.isSessionActive) return;

        // Show logout notification
        console.log('Session expired - auto logout');

        this.logout();
        if (this.store) {
            try {
                this.store.dispatch({ type: 'login/logout' });
            } catch { }
        }
    }

    // Check if session is still valid
    isSessionValid(): boolean {
        try {
            const last = localStorage.getItem('lastActivity');
            if (!last) {
                // No lastActivity but user is authenticated, consider valid
                const isAuth = localStorage.getItem('auth_isAuthenticated') === 'true';
                const userRaw = localStorage.getItem('auth_user');
                return !!(isAuth && userRaw);
            }
            const diff = Date.now() - parseInt(last);
            return diff < this.sessionTimeout;
        } catch {
            return false;
        }
    }

    // Get remaining session time in minutes
    getRemainingTime(): number {
        try {
            const last = localStorage.getItem('lastActivity');
            if (!last) return 0;
            const diff = Date.now() - parseInt(last);
            const remaining = this.sessionTimeout - diff;
            return Math.max(0, Math.floor(remaining / 60000));
        } catch {
            return 0;
        }
    }

    // Get remaining session time in seconds
    getRemainingTimeSeconds(): number {
        try {
            const last = localStorage.getItem('lastActivity');
            if (!last) return 0;
            const diff = Date.now() - parseInt(last);
            const remaining = this.sessionTimeout - diff;
            return Math.max(0, Math.floor(remaining / 1000));
        } catch {
            return 0;
        }
    }

    // Logout user and clear session
    logout() {
        this.isSessionActive = false;
        if (this.activityTimer) window.clearInterval(this.activityTimer);
        if (this.sessionExpiryTimer) window.clearInterval(this.sessionExpiryTimer);
        try {
            localStorage.removeItem('lastActivity');
        } catch { }
    }

    // Stop session management without clearing data
    stopSession() {
        this.isSessionActive = false;
        if (this.activityTimer) window.clearInterval(this.activityTimer);
        if (this.sessionExpiryTimer) window.clearInterval(this.sessionExpiryTimer);
    }

    // Set session timeout (in minutes)
    setSessionTimeout(minutes: number) {
        this.sessionTimeout = minutes * 60 * 1000;
    }

    // Extend session (useful for API calls)
    extendSession() {
        this.updateLastActivity();
    }

    // Check if user is currently authenticated
    isAuthenticated(): boolean {
        try {
            const isAuth = localStorage.getItem('auth_isAuthenticated') === 'true';
            const userRaw = localStorage.getItem('auth_user');
            return !!(isAuth && userRaw);
        } catch {
            return false;
        }
    }

    // Check if session is about to expire (within 1 minute)
    isSessionAboutToExpire(): boolean {
        try {
            const remaining = this.getRemainingTimeSeconds();
            return remaining > 0 && remaining <= 60; // 1 minute warning
        } catch {
            return false;
        }
    }

    // Get session status for debugging
    getSessionStatus() {
        return {
            isActive: this.isSessionActive,
            isAuthenticated: this.isAuthenticated(),
            isValid: this.isSessionValid(),
            remainingMinutes: this.getRemainingTime(),
            remainingSeconds: this.getRemainingTimeSeconds(),
            isAboutToExpire: this.isSessionAboutToExpire()
        };
    }
}

const sessionManager = new SessionManager();
export default sessionManager;