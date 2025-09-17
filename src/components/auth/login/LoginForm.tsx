'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@nextui-org/input';
import { Checkbox } from '@nextui-org/checkbox';
import { Button } from '@nextui-org/button';
import InputError from '../InputError';
import AuthSessionStatus from './AuthSessionStatus';
import { useAuth } from '@/hooks/auth';

interface LoginFormErrors {
    email?: string[];
    password?: string[];
    [key: string]: any;
}

const LoginForm: React.FC = () => {
    const router = useRouter();

    const { login } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/',
    });

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [shouldRemember, setShouldRemember] = useState<boolean>(true);
    const [errors, setErrors] = useState<LoginFormErrors>({});
    const [status, setStatus] = useState<string | null>(null);

    const validateEmail = (email: string) =>
        email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);
    const isInvalid = React.useMemo(() => {
        if (email === '') return false;
        return validateEmail(email) ? false : true;
    }, [email]);

    const submitForm = async (event: React.FormEvent) => {
        event.preventDefault();

        login({
            email,
            password,
            remember: shouldRemember,
            setErrors,
            setStatus,
        });
    };

    return (
        <div>
            <AuthSessionStatus className="mb-4" status={status} />
            <form onSubmit={submitForm}>
                <div className="pb-5 px-5">
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        label="Correo"
                        placeholder="Ingresar correo"
                        onChange={event => setEmail(event.target.value)}
                        isInvalid={isInvalid}
                        color={isInvalid ? 'danger' : 'default'}
                        errorMessage={isInvalid ? 'Ingresar un correo válido' : undefined}
                        required
                        autoFocus
                        size="lg"
                    />
                    <InputError messages={errors.email} className="mt-2" />
                </div>

                <div className="mt-4 pb-5 px-5">
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        label="Contraseña"
                        placeholder="Ingresar contraseña"
                        onChange={event => setPassword(event.target.value)}
                        required
                        autoComplete="current-password"
                        size="lg"
                    />
                    <InputError messages={errors.password} className="mt-2" />
                </div>

                <div className="block mt-4 pb-5 px-5">
                    <label htmlFor="remember_me" className="inline-flex items-center">
                        <Checkbox
                            id="remember_me"
                            name="remember"
                            isSelected={shouldRemember}
                            onChange={event => setShouldRemember(event.target.checked)}
                        />
                        <span className="text-sm">Recordar usuario</span>
                    </label>
                </div>

                <div className="flex items-center justify-center mt-4 px-5">
                    <Button type="submit" fullWidth size="lg" className="bg-slate-800 text-white">
                        Iniciar sesión
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;
