import { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { User } from '../context/users';
import { userApi } from '../services/api';


// Context interface
interface AuthContextType {
    isAuthenticated: boolean;
    role: string | null;
    ID: number;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ( { children }: { children: ReactNode } ) => {
    // if user has logged in
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [role, setRole] = useState<string | null>(null); // use to differentiate between tutor and lecturer
    const [ID, setID] = useState<number>(-1);


    // check if user has logged in before
    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            const parsed = JSON.parse(user);
            setIsAuthenticated(true);
            setRole(parsed.role);
            setID(parsed.id);
        }
    }, []);
    

    // login function
    const login = async (email: string, password: string): Promise<boolean> => {

        // check if user exists
        try{
            const user = await userApi.getUserLogin(email, password);
            if(!user){
                throw new Error("Invalid Login");
            }
            localStorage.setItem("user", JSON.stringify(user));
            setIsAuthenticated(true);
            setRole(user.role);
            setID(user.id);
            return true;
        } catch (error: any) {
            throw new Error(error.message);
            return false;
        }
    };

    // logout function
    const logout = () => {
        localStorage.removeItem('user'); // remove from local storage
        setIsAuthenticated(false);
        setRole(null);
    };
    return (
        <AuthContext.Provider value={{ isAuthenticated, role, ID, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within a AuthProvider');
    }
    return context;
};