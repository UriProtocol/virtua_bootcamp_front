'use client'
import axios from '@/lib/axios'
import { Button, Textarea } from '@nextui-org/react'
import React, { useState } from 'react'
import { toast } from 'sonner'

export default function CommentsComponent({post_uuid, mutate}: {post_uuid: string, mutate: () => void}) {

  const [isLoading, setIsLoading] = useState(false)
  const [comment, setComment] = useState('')

  async function handlePostComment(){

    setIsLoading(true)
    try {

      await axios.post('/api/comment', {comment, post_uuid})
      mutate()
      setComment("")
      toast.success('El comentario fue publicado exitosamente')
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Hubo un error al publicar el comentario')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex flex-col gap-3 w-full'>
      <Textarea 
        placeholder='Deja tu comentario...'
        value={comment}
        onValueChange={setComment}
      />
      <Button onPress={handlePostComment} isLoading={isLoading} color='primary' size='sm' className=' ml-auto'>
        Publicar comentario
      </Button>
    </div>
  )
}
