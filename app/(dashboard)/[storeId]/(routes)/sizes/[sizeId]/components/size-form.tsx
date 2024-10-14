"use client";

import { AlertModal } from "@/components/models/alert-model";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import {  Size } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

interface SizeFormProps {
  initialData: Size | null;
}
const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
});

type SizeFormValues = z.infer<typeof formSchema>;

export const SizeForm: React.FC<SizeFormProps> = ({
  initialData,
}) => {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  const title = initialData ? "Edit size" : "Create size";
  const description = initialData ? "Edit a size" : "Create a new size";
  const toastMessage = initialData ? "Size updated" : " Size Created";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<SizeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      value: "",
    },
  });

  const onSubmit = async (data: SizeFormValues) => {
    console.log("Submitting data:", data);
    console.log("Store ID:", params.storeId);

    const apiUrl = `/api/${params.storeId}/sizes`;
    console.log("API URL:", apiUrl);
    try {
      setIsLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/sizes/${params.sizeId}`,
          data
        );
      } else {
        // const response = await axios.post(`/api/${params.storeId}/sizes`, data);
        // console.log("Server response:", response.data);
        const response = await axios.post(apiUrl, data);
        console.log("Server response:", response.data);
      }
      router.refresh();
      router.push(`/${params.storeId}/sizes`);
      toast.success(toastMessage);
    } catch (error) {
      console.error("Submission error:", error);
      if (axios.isAxiosError(error)) {
        console.error("Response data:", error.response?.data);
        console.error("Response status:", error.response?.status);
        toast.error(`Error: ${error.response?.data || error.message}`);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(
        `/api/${params.storeId}/sizes/${params.sizeId}`
      );
      router.refresh();
      router.push(`/${params.storeId}/sizes`);
      toast.success("Size deleted.");
    } catch (error) {
      console.log(error);
      toast.error(
        "Make sure you removed all Products using this size first"
      );
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfrim={onDelete}
        isLoading={isLoading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />

        {initialData && (
          <Button
            variant="destructive"
            size="icon"
            disabled={isLoading}
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Size name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
                <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Size value"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isLoading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
      {/* <Separator /> */}
    </>
  );
};
