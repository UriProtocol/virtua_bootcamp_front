import React from 'react';

interface AuthSessionStatusProps extends React.HTMLAttributes<HTMLDivElement> {
    status?: string | null;
    className?: string;
}

const AuthSessionStatus: React.FC<AuthSessionStatusProps> = ({ status = null, className = '', ...props }) => {
    if (!status) {
        return null; // If there's no status, render nothing
    }

    return (
        <div
            className={`${className} font-medium text-sm text-green-600`}
            {...props}>
            {status}
        </div>
    );
};

export default AuthSessionStatus;
