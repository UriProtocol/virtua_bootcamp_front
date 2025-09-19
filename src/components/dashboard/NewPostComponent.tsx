import { useAuth } from '@/hooks/auth'
import axios from '@/lib/axios'
import { Add } from '@mui/icons-material'
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea, Tooltip, useDisclosure } from '@nextui-org/react'
import React, { useState } from 'react'
import { toast } from 'sonner'

export default function NewPostComponent({mutate}: {mutate: () => void}) {

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()

    const [isLoading, setIsLoading] = useState(false)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    const {user} = useAuth({middleware: 'auth'})

    async function submitPost(e: React.FormEvent){

        e.preventDefault()

        try {
            setIsLoading(true)
            await axios.post('/api/post', {name: title, description, user_uuid: user?.uuid})
            toast.success('Post publicado con éxito')
            mutate()
            onClose()
        } catch (error: any) {
            
            console.error(error)
            toast.error(error?.response?.data?.message || 'Hubo un error al publicar el post')
        } finally {
            setIsLoading(false)
        }

    }

    return (
        <>
            <Tooltip content='Agregar post' size='lg'>
                <Button
                    onPress={onOpen}
                    className=' bg-slate-400/20 border-slate-400 border-3 opacity-60 hover:opacity-80 transition-opacity p-8 w-full'
                    isIconOnly>
                    <Add className=' text-slate-500 text-xl' />
                </Button>
            </Tooltip>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='lg'>
                <ModalContent>
                    {
                        (onClose) =>
                            <form onSubmit={submitPost} className='flex flex-col gap-2'>
                                <ModalHeader>
                                    <h1 className=' text-2xl'>Agregar un nuevo post</h1>
                                </ModalHeader>
                                <ModalBody>
                                    <Input label='Título de tu post' value={title} onValueChange={setTitle}/>
                                    <Textarea label='Descripción de tu post' value={description} onValueChange={setDescription}/>
                                </ModalBody>
                                <ModalFooter>
                                    <Button size='lg' onPress={onClose} type='button'>Cerrar</Button>
                                    <Button size='lg' type='submit' color='primary' isLoading={isLoading}>Publicar post</Button>
                                </ModalFooter>
                            </form>

                    }
                </ModalContent>
            </Modal>
        </>
    )
}
