"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ProductColumn } from "./columns"
import { Button } from "@/components/ui/button"
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react"
import toast from "react-hot-toast"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import axios from "axios"
import { AlertModal } from "@/components/models/alert-model"

interface CellActionProps{
data: ProductColumn
}

export const CellAction: React.FC<CellActionProps> = ({data}) => {
    const [isLoading,setIsLoading]= useState(false)
    const [open,setOpen ]= useState(false)
    const router = useRouter()
    const params = useParams()
    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        toast.success("Product id copied to the clipboard");
      };

      const onDelete = async () => {
        try {
          setIsLoading(true);
          await axios.delete(
            `/api/${params.storeId}/products/${data.id}`
          );
          router.refresh();
     
          toast.success("Product deleted.");
        } catch (error) {
          console.log(error);
          toast.error(
            "Something went wrong"
          );
        } finally {
          setIsLoading(false);
          setOpen(false);
        }
      };
  return (
<>
<AlertModal isOpen={open} onClose={()=> setOpen(false)} onConfrim={onDelete} isLoading={isLoading} />
<DropdownMenu>
    <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4"/>
        </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
        <DropdownMenuLabel>
            Actions
        </DropdownMenuLabel>
        <DropdownMenuItem onClick={()=> onCopy(data.id)}>
            <Copy className="mr-2 h-4"/>
            Copy ID
        </DropdownMenuItem>
        <DropdownMenuItem onClick={()=> router.push(`/${params.storeId}/products/${data.id}`) }>
            <Edit className="mr-2 h-4"/>
            Update
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4"/>
            Delete
        </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</>

  )
}

