import { useState } from 'react';
import SideNav from "@/components/sidenav";
import Header from "@/components/header";
import Loading from '@/app/Loading'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleCollapse = (collapsed: boolean) => {
        setIsCollapsed(collapsed);
    };

    return (
        <div className="min-h-screen bg-gray-100">
                <div className="flex h-screen">
                    <div className={`flex-none transition-width duration-400 ${isCollapsed ? 'w-16' : 'w-64'}`}>
                        <SideNav onCollapse={handleCollapse}/>
                    </div>

                    <div className="flex flex-col flex-grow overflow-hidden">
                        <div className="flex-none">
                            <Header />
                        </div>

                        <div className="flex-grow overflow-y-auto p-6 md:p-12">
                            {children}
                        </div>
                    </div>
                </div>
        </div>
    )
}

export default DashboardLayout
