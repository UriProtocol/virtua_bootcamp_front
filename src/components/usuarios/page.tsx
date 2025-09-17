'use client'
import React, { useState, useCallback, useEffect } from 'react';
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
    Spacer,
    Tooltip,
    useDisclosure,
    ModalContent,
    Spinner
} from '@nextui-org/react';
import useSWR from "swr";
import axios from '@/lib/axios'
import { width } from '@mui/system';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CreateIcon from '@mui/icons-material/Create';

interface User {
    id: number;
    name: string;
    email: string;
    password: string;
}

export default function Usuarios() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [form, setForm] = useState({ id: 0, name: '', email: '', password: '' });

    const fetcher = () =>
        axios
            .get('/api/users').then((res) => res.data);

    const { data, mutate } = useSWR(['/api/users'], fetcher);

    const handleOpenModal = (user: User | null = null) => {
        setSelectedUser(user);
        setForm(user || { id: 0, name: '', email: '', password: '' });
        onOpen()
    };

    const handleCloseModal = () => {
        setSelectedUser(null);
        setForm({ id: 0, name: '', email: '', password: '' });
        onOpenChange();
    };

    // useEffect(() => {
    //     mutate();
    // }, [mutate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (!selectedUser) {
            try {
                const response = await axios.post('/api/setUser', form)
                mutate([...data, response.data], false)
            } catch (error) {
                console.log(error)
            }
        } else {
            try {
                const response = await axios.put(`/api/user/${selectedUser.id}`, form)
                mutate()
            } catch (error) {
                console.log(error)
            }
        }
        handleCloseModal()
    };

    const handleDelete = (id: number) => {

    };

    const renderCell = useCallback((item: any, columnKey: any) => {
        const cellValue = item[columnKey];

        switch (columnKey) {
            case "id":
                return (
                    <p className='text-regal-blue'>{cellValue}</p>
                );
            case "name":
                return (
                    <p className='text-regal-blue'>{cellValue}</p>
                );
            case "email":
                return (
                    <p className='text-regal-blue'>{cellValue}</p>
                );

            case "actions":
                return (
                    <div className="relative flex items-right gap-2">
                        <Tooltip content="Editar usuario" color='primary'>
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50"
                                onClick={() => handleOpenModal(item)}>
                                < CreateIcon
                                    color='primary'
                                />
                            </span>
                        </Tooltip>
                        <Tooltip color="danger" content="Eliminar usuario">
                            <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                <DeleteOutlineIcon
                                    color='warning' />
                            </span>
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue;
        }
    },
        [mutate]
    );

    // console.log(data);

    const columns = [
        { name: "ID", key: "id" },
        { name: "Nombre", key: "name" },
        { name: "Correo", key: "email" },
        { name: "Acciones", key: "actions" },
    ];

    return (
        <div>
            <div className='flex flex-row justify-between'>
                <div className='text-regal-blue text-3xl'> Crear usuarios </div>
                <Button onClick={() => handleOpenModal()} color="primary">
                    Crear Usuario
                </Button>
            </div>

            <Spacer y={1} />
            <Table
                aria-label="Usuarios"
            >
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn
                            key={column.key}
                            {...(column.key === "actions" && { width: '100' })}
                        >

                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody
                    emptyContent={"No hay usuarios por mostrar"}
                    items={data ?? []}
                    loadingContent={<Spinner />}
                >
                    {(item: any) => (
                        <TableRow key={item.id}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Modal para crear/editar */}
            <Modal
                closeButton
                aria-labelledby="modal-title"
                isOpen={isOpen}
                onOpenChange={onOpenChange}
            >
                <ModalContent>
                    {(onClose) =>
                        <>
                            <ModalHeader>
                                <h3 className='text-regal-blue'>{selectedUser ? 'Editar Usuario' : 'Crear Usuario'}</h3>
                            </ModalHeader>
                            <ModalBody>
                                <Input
                                    label="Nombre"
                                    placeholder="Ingresa el nombre"
                                    fullWidth
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                />
                                <Spacer y={0.5} />
                                <Input
                                    label="Email"
                                    placeholder="Ingresa el correo"
                                    fullWidth
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                />
                                {!selectedUser && (
                                    <div>
                                        <Spacer y={0.5} />
                                        <Input
                                            label="contraseña"
                                            type="password"
                                            placeholder="Ingresa la contraseña"
                                            fullWidth
                                            name="password"
                                            value={form.password}
                                            onChange={handleChange}
                                        />
                                    </div>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button onClick={handleCloseModal}>
                                    Cancelar
                                </Button>
                                <Button color="primary" onClick={handleSave}>
                                    Guardar
                                </Button>
                            </ModalFooter>
                        </>
                    }
                </ModalContent>


            </Modal>
        </div>
    );
}
