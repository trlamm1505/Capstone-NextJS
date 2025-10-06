import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// Define the shape of the context
interface NavigationContextType {
    allowNavigation: (route: string) => void;
    clearAllowedRoutes: () => void;
    isRouteAllowed: (route: string) => boolean;
}

// Create context with initial undefined
const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

// Custom hook for using navigation context
export const useNavigation = (): NavigationContextType => {
    const context = useContext(NavigationContext);
    if (!context) {
        throw new Error('useNavigation must be used within a NavigationProvider');
    }
    return context;
};

// Props for the provider
interface NavigationProviderProps {
    children: ReactNode;
}

// Provider component
export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
    const [allowedRoutes, setAllowedRoutes] = useState<Set<string>>(new Set());

    const allowNavigation = (route: string) => {
        setAllowedRoutes(prev => new Set([...prev, route]));
    };

    const clearAllowedRoutes = () => {
        setAllowedRoutes(new Set());
    };

    const isRouteAllowed = (route: string): boolean => {
        return allowedRoutes.has(route);
    };

    return (
        <NavigationContext.Provider value={{
            allowNavigation,
            clearAllowedRoutes,
            isRouteAllowed
        }}>
            {children}
        </NavigationContext.Provider>
    );
};
