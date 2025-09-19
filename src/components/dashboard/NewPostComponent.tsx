import { useAuth } from '@/hooks/auth'
import axios from '@/lib/axios'
import { Add } from '@mui/icons-material'
import { 
  Button, 
  Input, 
  Modal, 
  ModalBody, 
  ModalContent, 
  ModalFooter, 
  ModalHeader, 
  Textarea, 
  Tooltip, 
  useDisclosure 
} from '@nextui-org/react'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'


const postSchema = z.object({
  name: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  user_uuid: z.string().uuid("Usuario inválido"),
})

type FormErrors = {
  name?: string
  description?: string
}

export default function NewPostComponent({ mutate }: { mutate: () => void }) {

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()

  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [formErrors, setFormErrors] = useState<FormErrors>({})

  const { user } = useAuth({ middleware: 'auth' })

  async function submitPost(e: React.FormEvent) {
    e.preventDefault()

    // Reset errors
    setFormErrors({})

    const validation = postSchema.safeParse({
      name: title,
      description,
      user_uuid: user?.uuid ?? "",
    })

    if (!validation.success) {
      const newErrors: FormErrors = {}
      validation.error.errors.forEach(err => {
        if (err.path[0] === "name") newErrors.name = err.message
        if (err.path[0] === "description") newErrors.description = err.message
      })
      setFormErrors(newErrors)
      return
    }

    try {
      setIsLoading(true)
      await axios.post('/api/post', validation.data)
      toast.success('Post publicado con éxito')
      mutate()
      onClose()
      setTitle("")
      setDescription("")
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
          {(onClose) =>
            <form onSubmit={submitPost} className='flex flex-col gap-2'>
              <ModalHeader>
                <h1 className=' text-2xl'>Agregar un nuevo post</h1>
              </ModalHeader>
              <ModalBody className="space-y-3">
                <div>
                  <Input 
                    label='Título de tu post' 
                    value={title} 
                    onValueChange={setTitle}
                    isInvalid={!!formErrors.name}
                    errorMessage={formErrors.name}
                  />
                </div>
                <div>
                  <Textarea 
                    label='Descripción de tu post' 
                    value={description} 
                    onValueChange={setDescription}
                    isInvalid={!!formErrors.description}
                    errorMessage={formErrors.description}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button size='lg' onPress={onClose} type='button'>Cerrar</Button>
                <Button size='lg' type='submit' color='primary' isLoading={isLoading}>
                  Publicar post
                </Button>
              </ModalFooter>
            </form>
          }
        </ModalContent>
      </Modal>
    </>
  )
}
