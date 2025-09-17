import useSWR from 'swr'
import axios from '@/lib/axios'
import { useEffect, useState } from 'react'
import { useParams, useRouter, usePathname } from 'next/navigation'

interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
}

interface UseAuthReturn {
    user: User | null;
    loading: boolean;
    redirectPath: string;
    register: (props: RegisterProps) => Promise<void>;
    login: (props: LoginProps) => Promise<void>;
    forgotPassword: (props: ForgotPasswordProps) => Promise<void>;
    resetPassword: (props: ResetPasswordProps) => Promise<void>;
    resendEmailVerification: (props: ResendEmailVerificationProps) => void;
    logout: () => Promise<void>;
}

interface AuthProps {
    middleware: 'guest' | 'auth';
    redirectIfAuthenticated?: string;
}

interface RegisterProps {
    setErrors: (errors: any) => void;
    [key: string]: any;
}

interface LoginProps {
    setErrors: (errors: any) => void;
    setStatus: (status: string | null) => void;
    [key: string]: any;
}

interface ForgotPasswordProps {
    setErrors: (errors: any) => void;
    setStatus: (status: string | null) => void;
    email: string;
}

interface ResetPasswordProps {
    setErrors: (errors: any) => void;
    setStatus: (status: string | null) => void;
    [key: string]: any;
}

interface ResendEmailVerificationProps {
    setStatus: (status: string) => void;
}

export const useAuth = ({ middleware, redirectIfAuthenticated }: AuthProps): UseAuthReturn => {
    const router = useRouter()
    const params = useParams() 
    const pathname = usePathname()
    const [loading, setLoading] = useState(true);
    const [redirectPath, setRedirectPath] = useState("");

    const { data: user, error, mutate } = useSWR('/api/user', () =>
        axios
            .get('/api/user')
            .then(res => res.data)
            .catch(error => {
                if (error.response.status == 401) throw error
                    router.push('/login')
                
            }).finally(() => setLoading(false))
    )

    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const register = async ({ setErrors, ...props }: RegisterProps) => {
        await csrf()

        setErrors([])

        axios
            .post('/register', props)
            .then(() => mutate())
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const login = async ({ setErrors, setStatus, ...props }: LoginProps) => {
        await csrf()

        setErrors([])
        setStatus(null)

        axios
            .post('/login', props)
            .then(() => mutate())
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const forgotPassword = async ({ setErrors, setStatus, email }: ForgotPasswordProps) => {
        await csrf()

        setErrors([])
        setStatus(null)

        axios
            .post('/forgot-password', { email })
            .then(response => setStatus(response.data.status))
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const resetPassword = async ({ setErrors, setStatus, ...props }: ResetPasswordProps) => {
        await csrf()

        setErrors([])
        setStatus(null)

        axios
            .post('/reset-password', { token: params.token, ...props })
            .then(response =>
                router.push('/login?reset=' + btoa(response.data.status)),
            )
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const resendEmailVerification = ({ setStatus }: ResendEmailVerificationProps) => {
        axios
            .post('/email/verification-notification')
            .then(response => setStatus(response.data.status))
    }

    const logout = async () => {
        if (!error) {
            await axios.post('/logout').then(() => mutate())
        }

        window.location.pathname = '/login'
    }

    useEffect(() => {
        if (!loading) {
            if (middleware === 'guest' && redirectIfAuthenticated && user) {
                router.push(redirectIfAuthenticated);
                return;
            }

            if (middleware === 'guest' && !user && pathname !== '/login') {
                setRedirectPath(pathname);
                router.push('/login');
                return;
            }

            if (middleware === 'guest' && user && pathname === '/login') {
                router.push('/');
                return;
            }

            if (middleware === 'auth' && !user?.email_verified_at) {
                // router.push('/verify-email')
            }

            if (pathname === '/verify-email' && user?.email_verified_at) {
                router.push(redirectIfAuthenticated || '/');
                return;
            }

            if (middleware === 'auth' && error) {
                logout();
            }
        }
    }, [user, error])

    return {
        user,
        loading,
        redirectPath,
        register,
        login,
        forgotPassword,
        resetPassword,
        resendEmailVerification,
        logout,
    }
}
