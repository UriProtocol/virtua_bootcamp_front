import axios from "@/lib/axios";
import { mutate } from "swr";
import { z as zod } from "zod";

const errorMessages = {
    name_error: "El campo nombre es requerido",
    email_error: "El campo email es requerido",
    password_error: "El campo contraseña es requerido",
};

const schema = zod.object({
    name: zod.string({ message: errorMessages.name_error }),
    email: zod.string({ message: errorMessages.email_error }),
    password: zod.string({ message: errorMessages.password_error }),
});

export type State = {
    errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
    };
    message?: string | null;
    messageError?: string | null;
    validationErrors?: {
        name?: string[];
        email?: string[];
        password?: string[];
    } | null;
};

export async function createUserRecord(
    query: string,
    page: number,
    sort_by: string,
    sort_order: string,
    per_page: number,
    formData: FormData,
) {
    const name = (formData.get("name") as string) || null;
    const email = (formData.get("email") as string) || null;
    const password = (formData.get("password") as string) || null;

    const validatedFields = schema.safeParse({
        name, email, password
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            messageError: "Hay campos requeridos sin ingresar. No se puede crear.",
            message: "",
        };
    }
    
    try {
        const response = await axios.post("/api/user/create", {
            name: validatedFields.data.name,
            email: validatedFields.data.email,
            password: validatedFields.data.password,
        });
        mutate([`/api/users?page=${page}`, query, sort_by, sort_order, per_page]);

        return {
            message: response.data.message,
        };
    } catch (error: any) {
        console.log(error)
        if (error.response && error.response.data.errors) {
            return {
                validationErrors: error.response.data.errors,
            };
        } else {
            return {
                messageError: "Ocurrió un error inesperado. No se puede crear.",
                message: "",
            };
        }
    }
}
