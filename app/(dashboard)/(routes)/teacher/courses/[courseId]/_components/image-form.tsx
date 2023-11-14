"use client";

import * as z from 'zod';
import axios from 'axios';

import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { ImageIcon, Pencil, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Course } from '@prisma/client';
import Image from 'next/image';
import { FileUpload } from '@/components/file-upload';

interface ImageFormProps {
  initialData: Course
  courseId: string
}

const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: 'Image is required'
  })
})

const ImageForm = ({ initialData, courseId } : ImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const toggleEdit = () => setIsEditing(current => !current);
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success('Course Updated')
      toggleEdit()
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  return (
    <div className='mt-6 border bg-slate-100 rounded-md p-4'>
      <div className='font-medium flex items-center justify-between'>
        Course image
        <Button onClick={toggleEdit} variant={`ghost`}>
          {isEditing && (
            <>Cancel</>
          )} 

          {!isEditing && !initialData.imageUrl && (
            <>
              <PlusCircle
                style={{
                  height: "1rem",
                  width: "1rem",
                  marginRight: "0.5rem"
                }}
              />
                Add an Image
            </>
          )}
          
          {!isEditing && initialData.imageUrl && (
            <>
              <Pencil className='h-4 w-4 mr-2'/>
              Edit image
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        !initialData.imageUrl ? (
          <div
            className='h-60 bg-slate-200 rounded-md'
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <ImageIcon className='h-10 w-10 text-slate-500'/>
          </div>
        ) : (
          <div
            className='aspect-video'
            style={{
              position: "relative",
              marginTop: "0.5rem",
            }}
          >
            <Image 
              alt='upload'
              fill
              className='object-cover rounded-md'
              src={initialData.imageUrl}
            />
          </div>
        )
      )}  

      {isEditing && (
        <div
        >
          <FileUpload 
            endPoint='courseImage'
            onChange={(url) => {
              if (url) {
                onSubmit({ imageUrl: url});
              }
            }}
          />
          <div
            className='text-muted-foreground'
            style={{
              fontSize: "0.75rem",
              lineHeight: "1rem",
              marginTop: "1rem",
            }}
          >
            16:0 aspect ratio recommended
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageForm