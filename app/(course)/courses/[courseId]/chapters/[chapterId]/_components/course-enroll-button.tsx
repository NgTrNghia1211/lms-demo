"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { useState } from "react";

interface CourseEnrollButtonProps {
  courseId: string;
  price: number; 
}

const CourseEnrollButton = ({
  courseId,
  price,
} : CourseEnrollButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const onClick = () => {
    // TODO: SET UP PAYMENT WITH STRIPE
  }

  return (
    <Button
      className="w-full md:w-auto"
      size={"sm"}
    >
      Enroll for {formatPrice(price)}
    </Button>
  )
}

export default CourseEnrollButton