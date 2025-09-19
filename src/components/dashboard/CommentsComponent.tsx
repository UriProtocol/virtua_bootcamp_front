'use client'

import { useAuth } from '@/hooks/auth'
import axios from '@/lib/axios'
import { Comment } from '@/lib/types'
import { Delete, MoreHoriz } from '@mui/icons-material'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Textarea } from '@nextui-org/react'
import Image from 'next/image'
import React, { useState } from 'react'
import { toast } from 'sonner'
import Swal from 'sweetalert2'
import { z } from 'zod'

const commentSchema = z.object({
    comment: z.string().min(2, "El comentario debe tener al menos 2 caracteres").max(255, "El comentario no puede exceder los 255 caracteres"),
    post_uuid: z.string().uuid("Post inválido"),
})

type FormErrors = {
    comment?: string
}

export default function CommentsComponent({ comments, post_uuid, mutate }: { comments: Comment[], post_uuid: string, mutate: () => void }) {

    const { user } = useAuth({ middleware: 'auth' })

    const [formErrors, setFormErrors] = useState<FormErrors>({})

    const [isLoading, setIsLoading] = useState(false)
    const [comment, setComment] = useState('')

    const [isLoadingDelete, setIsLoadingDelete] = useState(false)

    async function handleSubmitComment() {

        // Reset errors
        setFormErrors({})

        const validation = commentSchema.safeParse({
            comment,
            post_uuid
        })

        if (!validation.success) {
            const newErrors: FormErrors = {}
            validation.error.errors.forEach(err => {
                if (err.path[0] === "comment") newErrors.comment = err.message
            })
            setFormErrors(newErrors)
            return
        }

        try {
            setIsLoading(true)
            await axios.post('/api/comment', validation.data)
            toast.success('Comentario publicado con éxito')
            mutate()
            setComment("")
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Hubo un error al publicar el comentario')
        } finally {
            setIsLoading(false)
        }
    }

    async function handleDeleteComment(comment_uuid: string) {
        try {

            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: "¡No podrás revertir esta acción!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar',
                reverseButtons: true
            });

            // Si el usuario cancela, no hacer nada
            if (!result.isConfirmed) {
                return;

            }
            setIsLoadingDelete(true)
            await axios.delete(`/api/comment/${comment_uuid}`)
            toast.info('Comentario eliminado con éxito')
            mutate()
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Hubo un error al eliminar el comentario')
        } finally {
            setIsLoadingDelete(false)
        }
    }

    return (
        <div className='flex flex-col'>
            <Textarea
                aria-label='Comentario'
                placeholder='Deja tu comentario...'
                value={comment}
                onValueChange={setComment}
                rows={2}
                isDisabled={isLoading}
                isInvalid={!!formErrors.comment}
                errorMessage={formErrors.comment}
            />
            <div className='flex justify-end gap-3 mt-3'>
                <Button color='primary' size='sm' isLoading={isLoading} onPress={handleSubmitComment}>Publicar comentario</Button>
            </div>
            {
                comments.map(comment => (
                    <div className='flex gap-4 mb-6 px-4' key={comment.uuid}>
                        <div>
                            <Image
                                alt="heroui logo"
                                height={30}
                                src='/images/defaultpfp.jpg'
                                width={30}
                                className=" rounded-full"
                            />
                        </div>
                        <div className='flex flex-col gap-1 w-full mr-4'>
                            <div className='flex gap-2 items-start'>
                                <p className=' font-semibold'>{comment.commented_by_uuid == user?.uuid ? 'Yo' : 'Usuario'}</p>
                                {
                                    (comment.commented_by_uuid == user?.uuid && !isLoadingDelete) && (
                                        <Dropdown>
                                            <DropdownTrigger>
                                                <button className=' bg-transparent -mt-0.5'>
                                                    <MoreHoriz className=' opacity-40' />
                                                </button>
                                            </DropdownTrigger>
                                            <DropdownMenu aria-label="Static Actions">
                                                <DropdownItem key="delete" className="text-danger" color="danger" onPress={() => handleDeleteComment(comment.uuid)}>
                                                    Eliminar comentario
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                    )
                                }
                            </div>
                            <div className='flex justify-between'>
                                <p className=' opacity-75 text-sm'>{comment.comment}</p>
                                <p className=' opacity-50 text-sm w-48 text-right'>{new Date(comment.created_at).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}
