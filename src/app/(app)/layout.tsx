'use client'

import { useAuth } from '@/hooks/auth'
import Loading from '@/app/Loading'
import { useEffect } from 'react'
import { useRouter } from "next/navigation";
import Layout from '@/components/layout/layout';
import { Toaster} from 'sonner';

const AppLayout = ({ children }: {children: React.ReactNode }) => {
    const { user, loading } = useAuth({ middleware: 'auth' })
    const router = useRouter();
    
    useEffect(() => {
        if(!user && !loading){
            router.push("/login");
        }
    } ,[user, loading]);

    if (!user) {
        return <Loading />
    }

    return (
        <div className="min-h-screen bg-gray-100">
                <Layout>
                    <Toaster richColors expand visibleToasts={9} />
                    {children}
                </Layout>
        </div>
    )
}

export default AppLayout
