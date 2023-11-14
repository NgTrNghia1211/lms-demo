"use client";

import * as z from 'zod';
import axios from 'axios';

import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { File, ImageIcon, Loader2, Pencil, PlusCircle, X } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Attachment, Course } from '@prisma/client';
import Image from 'next/image';
import { FileUpload } from '@/components/file-upload';

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[]};
  courseId: string
}

const formSchema = z.object({
  url: z.string().min(1)
})

const AttachmentForm = ({ initialData, courseId } : AttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const toggleEdit = () => setIsEditing(current => !current);
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, values);
      toast.success('Course Updated')
      toggleEdit()
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  const onDelete = async(id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
      toast.success('Attachment Deleted')

    } catch (error) {
      toast.error('Something went wrong') 
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className='mt-6 border bg-slate-100 rounded-md p-4'>
      <div className='font-medium flex items-center justify-between'>
        Course attachments
        <Button onClick={toggleEdit} variant={`ghost`}>
          {isEditing && (
            <>Cancel</>
          )} 

          {!isEditing && (
            <>
              <PlusCircle
                style={{
                  height: "1rem",
                  width: "1rem",
                  marginRight: "0.5rem"
                }}
              />
                Add a file
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <>
          {initialData.attachments.length === 0 && (
            <p className='text-sm mt-2 text-slate-500 italic'>
              No attachments yet
            </p>
          )}

          {initialData.attachments.length > 0 && (
            <div className='space-y-2'>
              {initialData.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className='bg-sky-100 border-sky-200 border text-sky-700 rounded-md'
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.75rem',
                    width: '100%'
                  }}
                >
                  <File className='h-4 w-4 mr-2 flex-shrink-0'/>
                  <p className='text-xs line-clamp-1'>{attachment.name}</p>
                  {deletingId === attachment.id && (
                    <div>
                      <Loader2 className='h-4 w-4 ml-1 animate-spin' />
                    </div>
                  )}
                  {deletingId !== attachment.id && (
                    <button
                      className='ml-auto hover:opacity-50 transition'
                      onClick={() => onDelete(attachment.id)}
                    >
                      <X className='h-4 w-4' />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

        </>
      )}  

      {isEditing && (
        <div
        >
          <FileUpload 
            endPoint='courseAttachment'
            onChange={(url) => {
              if (url) {
                onSubmit({ url: url});
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
            Add any thing your students must complete in this course
          </div>
        </div>
      )}
    </div>
  )
}

export default AttachmentForm