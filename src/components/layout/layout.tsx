import { useState } from 'react';
import SideNav from "@/components/sidenav";
import Header from "@/components/header";
import Loading from '@/app/Loading'
import { Card } from '@nextui-org/react';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {

    return (
        <div className="min-h-screen bg-gray-100">
                <div className="flex h-screen">
                    <div className={`flex-none transition-width duration-400 w-72`}>
                        <SideNav/>
                    </div>

                    <div className="flex flex-col flex-grow overflow-hidden">
                        <div className="flex-none">
                            <Header />
                        </div>

                        <div className="flex-grow overflow-y-auto p-6 md:p-12">
                            <Card className=' p-12 h-full overflow-y-auto'>
                                {children}
                            </Card>
                        </div>
                    </div>
                </div>
        </div>
    )
}

export default DashboardLayout
