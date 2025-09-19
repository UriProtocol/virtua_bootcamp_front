import { useAuth } from '@/hooks/auth'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, } from '@nextui-org/react';
import Image from 'next/image';

const Header = () => {
    const { user, logout } = useAuth({ middleware: 'auth' })

    return (

        <div className="flex items-center justify-between p-4 bg-white text-white h-20 shadow">
            <h1 className="text-lg font-bold"></h1>
            {user ? (
                <div className="flex items-center space-x-4">
                    <Dropdown placement="bottom-start">
                        <DropdownTrigger>
                            <div className='flex flex-row items-center cursor-pointer'>
                                <div className='flex flex-col pr-6 text-right'>
                                    <span className='text-regal-blue font-medium text-lg'>{user.name}</span>
                                    <span className='text-regal-blue/50 text-sm'>{user.email}</span>
                                </div>
                                <Image
                                    width={70}
                                    height={70}
                                    alt="user pfp"
                                    className="w-10 h-10 rounded-full align-middle"
                                    src='/images/defaultpfp.jpg'
                                />
                            </div>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Acciones" variant="flat">
                            <DropdownItem
                                key="Perfil"
                                className="text-regal-blue"
                            >
                                Perfíl
                            </DropdownItem>
                            <DropdownItem
                                key="Cerrar sesion"
                                color="danger"
                                className='text-regal-blue'
                                onClick={logout}

                            >
                                Cerrar sesión
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            ) : (
                <span></span>
            )}
        </div>
    );
};

export default Header;
