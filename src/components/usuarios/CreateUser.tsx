import { Modal, ModalContent, ModalHeader, ModalBody, Spacer, ModalFooter, Checkbox } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { toast } from "sonner";
import { Input } from "@nextui-org/input";
import { useEffect, useState, useActionState, startTransition } from "react";
import { createUserRecord } from "./lib/CreateActions";

type Props = {
    isOpen?: boolean;
    onOpenChange?: any;
    query: string;
    page: number;
    sort_by: string;
    sort_order: string;
    per_page: number;
};

export default function CreateUser(props: Props) {
    const { isOpen, onOpenChange, query, page, sort_by, sort_order, per_page } = props;
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

    const createRecordWithParams = (state: any, formData: FormData) => createUserRecord(query, page, sort_by, sort_order, per_page, formData)
    const [state, dispatch] = useActionState(createRecordWithParams, initialState);


    useEffect(() => {
        if (typeof state.errors === 'object' && state.errors?.name) toast.error(state.errors.name.join(', '));

        if (state.message) {
            toast.success(state.message);
            handleCloseModal();
        }

        if (state.messageError) toast.error(state.messageError);

        if (state.validationErrors?.name) {
            state.validationErrors.name.forEach((error: string) =>
                toast.error(error)
            );
        }
        setLoading(false);
    }, [state]);

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

    const handleCloseModal = () => {
        setFormState({
            name: '',
            email: '',
            password: ''
        });
        onOpenChange();
    };

    return (
        <>
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
                                    <h3 className='text-black'>Crear Usuario</h3>
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
                                        placeholder="Ingresa la contraseña"
                                        isRequired
                                        fullWidth
                                        name="password"
                                        value={formState.password}
                                        onChange={handleInputChange}
                                        errorMessage={
                                            state.validationErrors?.password || (typeof state.errors === 'object' && state.errors?.password)
                                        }
                                    />
                                </ModalBody>
                                <ModalFooter>
                                    <Button onPress={handleCloseModal}>
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
