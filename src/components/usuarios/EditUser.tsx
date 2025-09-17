import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Spacer,
    Button,
    Input,
    Tooltip,
    Checkbox
} from "@nextui-org/react";
import { toast } from "sonner";
import { useEffect, useState, useActionState, startTransition } from "react";
import { editUserRecord } from "./lib/EditActions";
import CreateIcon from '@mui/icons-material/Create';

interface User {
    uuid: string;
    name: string;
    email: string;
}

type Props = {
    uuid: string;
    user: User;
    query: string;
    page: number;
    sort_by: string;
    sort_order: string;
    per_page: number;
};

export default function EditUser(props: Props) {
    const { uuid, user, query, page, sort_by, sort_order, per_page } = props;
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [formState, setFormState] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState<boolean>(false);

    const initialState = {
        message: "",
        messageError: "",
        errors: {},
        validationErrors: undefined,
    };

    const editRecordWithUuid = (state: any, formData: FormData) => editUserRecord(query, page, uuid, sort_by, sort_order, per_page, formData);
    const [state, dispatch] = useActionState(editRecordWithUuid, initialState);

    useEffect(() => {
        if (typeof state.errors === 'object' && state.errors?.name) toast.error(state.errors.name.join(', '));

        if (state.message) {
            toast.success(state.message);
            onOpenChange();
        }

        if (state.messageError) toast.error(state.messageError);

        if (state.validationErrors?.name) {
            state.validationErrors.name.forEach((error: string) =>
                toast.error(error)
            );
        }
        setLoading(false);
    }, [state]);

    useEffect(() => {
        setFormState({
            name: user.name,
            email: user.email,
            password: "",
        });
    }, [user]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        setFormState({ ...formState, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();

        for (const [key, value] of Object.entries(formState)) {
            formData.append(key, value.toString());
        }
        startTransition(() => {
            dispatch(formData);
        });
    };

    return (
        <>
            <Tooltip content="Editar usuario" color='primary'>
                <span className="text-lg text-default-400 cursor-pointer active:opacity-50"
                    onClick={() => onOpen()}>
                    < CreateIcon
                        color='primary'
                    />
                </span>
            </Tooltip>

            <Modal
                closeButton
                aria-labelledby="Registrar usuario"
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                backdrop="blur"
                size="lg"
            >
                <ModalContent>
                    {(onClose) =>
                        <>
                            <form onSubmit={handleSubmit}>
                                <ModalHeader>
                                    <h3 className='text-black'>Modificar usuario</h3>
                                </ModalHeader>
                                <ModalBody>
                                    <Input
                                        label="Nombre"
                                        type="text"
                                        description="Ingresa el nombre del usuario"
                                        placeholder="Ingresa el nombre"
                                        isRequired
                                        fullWidth
                                        name="name"
                                        value={formState.name}
                                        onChange={handleInputChange}
                                        errorMessage={
                                            state.validationErrors?.name || (typeof state.errors === 'object' && state.errors?.name)
                                        }
                                    />
                                    <Spacer y={0.5} />
                                    <Input
                                        label="Email"
                                        type="email"
                                        description="Ingresa el correo del usuario"
                                        placeholder="Ingresa el correo"
                                        isRequired
                                        fullWidth
                                        name="email"
                                        value={formState.email}
                                        onChange={handleInputChange}
                                        errorMessage={
                                            state.validationErrors?.email || (typeof state.errors === 'object' && state.errors?.email)
                                        }
                                    />
                                    <Spacer y={0.5} />
                                    <Input
                                        label="contraseña"
                                        type="password"
                                        description="Ingresa la contraseña del usuario"
                                        placeholder="******************"
                                        fullWidth
                                        name="password"
                                        value={formState.password}
                                        onChange={handleInputChange}
                                    />
                                </ModalBody>
                                <ModalFooter>
                                    <Button onPress={onOpenChange}>
                                        Cancelar
                                    </Button>
                                    <Button
                                        type='submit'
                                        isLoading={loading}
                                        className="bg-regal-blue text-white">
                                        Guardar
                                    </Button>
                                </ModalFooter>
                            </form>
                        </>
                    }
                </ModalContent>
            </Modal>
        </>
    );
}
