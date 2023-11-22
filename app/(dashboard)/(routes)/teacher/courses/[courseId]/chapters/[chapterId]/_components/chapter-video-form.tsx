"use client";

import * as z from 'zod';
import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Pencil, PlusCircle, Video } from 'lucide-react';
import MuxPlayer from "@mux/mux-player-react";

import { Button } from '@/components/ui/button';
import { MuxData, Chapter } from '@prisma/client';
import { FileUpload } from '@/components/file-upload';

interface ChapterVideoFormProps {
  initialData: Chapter & { muxData?: MuxData | null }
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  videoUrl: z.string().min(1, {
    message: 'Video is required'
  })
})

const ChapterVideoForm = ({ initialData, courseId, chapterId } : ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const toggleEdit = () => setIsEditing(current => !current);
  
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
        Chapter Video
        <Button onClick={toggleEdit} variant={`ghost`}>
          {isEditing && (
            <>Cancel</>
          )} 

          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle
                style={{
                  height: "1rem",
                  width: "1rem",
                  marginRight: "0.5rem"
                }}
              />
                Add an Video
            </>
          )}
          
          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className='h-4 w-4 mr-2'/>
              Edit video
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        !initialData.videoUrl ? (
          <div
            className='h-60 bg-slate-200 rounded-md'
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Video className='h-10 w-10 text-slate-500'/>
          </div>
        ) : (
          <div
            className='aspect-video'
            style={{
              position: "relative",
              marginTop: "0.5rem",
            }}
          >
            <MuxPlayer 
              playbackId={initialData?.muxData?.playbackId || ''}
            />
          </div>
        )
      )}  

      {isEditing && (
        <div
        >
          <FileUpload 
            endPoint='chapterVideo'
            onChange={(url) => {
              if (url) {
                onSubmit({ videoUrl: url});
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
            Upload this chapter's video
          </div>
        </div>
      )}

      {initialData.videoUrl && !isEditing && (
        <div className='text-xs text-muted-foreground mt-2'>
          Video can take a few minute to process. Refresh if video does not appear!
        </div>
      )}
    </div>
  )
}

export default ChapterVideoForm