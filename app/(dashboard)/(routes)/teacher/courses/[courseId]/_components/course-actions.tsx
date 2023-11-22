'use client';

import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash } from "lucide-react";

import ConfirmModal from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";

interface CourseActionsProps {
  disabled: boolean;
  courseId: string;
  isPublished: boolean;
}

const CourseActions = ({
  disabled,
  courseId,
  isPublished
} : CourseActionsProps) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      if (isPublished) {
        await axios.patch(`/api/courses/${courseId}/unpublish`);
        toast.success('Course unpublished');
      } else {
        await axios.patch(`/api/courses/${courseId}/publish`);
        toast.success('Course published');
        confetti.onOpen();
      }
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false);
    }
  } 

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/courses/${courseId}`);
      toast.success(`Course is successfully deleted!`);
      router.refresh();
      router.push(`/teacher/courses`)
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <div
      className="flex items-center gap-x-2"
    > 
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        variant={"outline"}
        size={"sm"}
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <Button
        size={"sm"}
        disabled={isLoading}
      > 
        <ConfirmModal
          onConfirm={onDelete}
        >
          <Trash className="h-4 w-4"/>
        </ConfirmModal>
      </Button>
    </div>
  )
}

export default CourseActions