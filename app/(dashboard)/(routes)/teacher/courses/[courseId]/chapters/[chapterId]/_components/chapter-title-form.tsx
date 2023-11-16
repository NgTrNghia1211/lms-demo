"use client";

import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ChapterTitleFormProps {
  initialData: {
    title: string;
  },
  courseId: string,
  chapterId: string
}

const formSchema = z.object({
  title: z.string().min(1)
})

const ChapterTitleForm = ({ initialData, courseId, chapterId } : ChapterTitleFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const toggleEdit = () => setIsEditing(current => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
  })
  
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
      toast.success('Chapter Updated')
      toggleEdit()
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  return (
    <div className='mt-6 border bg-slate-100 rounded-md p-4'>
      <div className='font-medium flex items-center justify-between'>
        Chapter title
        <Button onClick={toggleEdit} variant={`ghost`}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className='h-4 w-4 mr-2'/>
              Edit title
            </>
          )}
        </Button>
      </div>
      {!isEditing ? (
        <p
          style={{
            fontSize: "0.875rem",
            lineHeight: "1.25rem"
          }}
        >
          {initialData.title}
        </p>
      ) : (
        <Form {...form}>
          <form action=""
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
            style={{
              marginTop: "1rem"
            }}
          >
            <FormField 
              control={form.control}
              name='title'
              render={({field}) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      disabled={isSubmitting}
                      placeholder="e.g. 'Introduction'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                columnGap: '0.5rem'
              }}
            >
              <Button
                disabled={!isValid || isSubmitting}
                type='submit'
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}

export default ChapterTitleForm