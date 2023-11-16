"use client";

import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { cn } from '@/lib/utils';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { Loader2, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Chapter, Course } from '@prisma/client';
import { Input } from '@/components/ui/input';
import ChaptersList from './chapters-list';

interface ChaptersFormProps {
  initialData: Course & {chapters: Chapter[]} ,
  courseId: string
}

const formSchema = z.object({
  title: z.string().min(1)
})

const ChaptersForm = ({ initialData, courseId } : ChaptersFormProps) => {
  const [isCreating, setIsCreating] =useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const toggleCreating = () => setIsCreating(current => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: ""
    }
  })
  
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/chapters`, values);
      toast.success('Chapter Updated')
      toggleCreating()
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  const onReorder = async (updateData: {id: string, position: number}[]) => {
    try {
      setIsUpdating(true);
      await axios.put(`/api/courses/${courseId}/chapters/reorder`, {list: updateData});
      toast.success('Chapter Reordered Successfully')
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsUpdating(false);
    }
  }

  const onEdit = (id: string) => {
    router.push(`/teacher/courses/${courseId}/chapters/${id}`);
  }

  return (
    <div className='relative mt-6 border bg-slate-100 rounded-md p-4'>
      {isUpdating && (
        <div className='absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center'>
          <Loader2 
            className='animate-spin text-sky-700'
            style={{
              height: '1.5rem',
              width: '1.5rem',
            }}
          />
        </div>
      )}
      
      <div className='font-medium flex items-center justify-between'>
        Course chapters
        <Button onClick={toggleCreating} variant={`ghost`}>
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className='h-4 w-4 mr-2'/>
              Add a chapter
            </>
          )}
        </Button>
      </div>
      {isCreating && (
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
                      placeholder="e.g. 'Introduction ...'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={!isValid || isSubmitting}
              type='submit'
            >
              Create
            </Button>
          </form>
        </Form>
      )}
      {!isCreating && (
        <div
          className={cn(
            "text-sm mt-2",
            !initialData.chapters.length && 'text-slate-500 italic'
          )}
        >
          {!initialData.chapters.length && "No chapters"}
          <ChaptersList 
            onEdit={onEdit}
            onReorder={onReorder}
            items={initialData.chapters || []}
          />
        </div>
      )}
      {!isCreating && (
        <p
          className='text-xs text-muted-foreground'
          style={{
            marginTop: "1rem",
          }}
        >
          Drag and drop to re-order the chapters
        </p>
      )}
    </div>
  )
}

export default ChaptersForm