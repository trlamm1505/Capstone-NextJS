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
        // Do not refresh lastActivity on init; we want to detect real inactivity across reloads
        // Immediately check validity before wiring listeners, so expired sessions are logged out on load
        if (!this.isSessionValid()) {
            this.autoLogout();
            return;
        }
        this.startActivityTracking();
        this.startSessionTimer();
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
        }, 30000) as unknown as number; // check every 30s
    }

    // Auto logout when session expires
    private autoLogout() {
        if (!this.isSessionActive) return;
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
            if (!last) return false;
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
}

const sessionManager = new SessionManager();
export default sessionManager;