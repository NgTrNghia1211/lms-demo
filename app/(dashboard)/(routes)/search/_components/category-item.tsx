"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IconType } from "react-icons";
import qs from 'query-string';

import { cn } from "@/lib/utils";

interface CategoryItemProps {
  label: string;
  icon?: IconType;
  value?: string;
}

const CategoryItem = ({
  label,
  icon: Icon,
  value,
} : CategoryItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get("categoryId");
  const currentTitle = searchParams.get("title");

  const isSelected = currentCategoryId === value;

  const onClick = () => {
    const ct = isSelected ? null : value;

    const url = qs.stringifyUrl({
      url: pathname,
      query: {
        title: currentTitle,
        categoryId: isSelected ? null : value,
      }
    }, { skipNull: true, skipEmptyString: true });

    console.log('url: ', url);

    // ! Don't know why when router.push working there is only one params 
    // ! While console.log("") the url with 2 params

    router.push(`/search?categoryId=${ct}&title=${currentTitle}`);
  };

  

  return (
    <button
      onClick={onClick}
      className={cn(
        "py-2 px-3 text-sm border border-slate-200 rounded-full flex items-center gap-x-1",
        "hover:border-sky-700 transition",
        isSelected && "border-sky-700 bg-sky-200/20 text-sky-800"
      )}
      type="button"
    >
      {Icon && <Icon size={20} />}
      <div className="truncate">
        {label}
      </div>
    </button>
  )
}

export default CategoryItem;