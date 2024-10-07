"use client";


import axios from "axios"
import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import toast from "react-hot-toast";

const formSchema = z.object({
  name: z.string().min(1),
});
export const StoreModal = () => {
  const storeModal = useStoreModal();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // TODO : create store
    console.log(values);
    try {
      setIsLoading(true);
      const response = await axios.post('/api/stores', values)
      console.log(response.data)
      window.location.assign(`/${response.data.id}`)
    //   toast.success("Store created.")
    } catch (error) {
      toast.error("Something went wrong")
      console.log(error);

    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Modal
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
      description="Add a new store to manage product and catgories"
      title="Create Store"
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="E-Commerce"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button
                  disabled={isLoading}
                  variant={"outline"}
                  onClick={storeModal.onClose}
                >
                  {" "}
                  Cancel{" "}
                </Button>
                <Button disabled={isLoading} type="submit">
                  {" "}
                  Continue{" "}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
      Future Create Store Form
    </Modal>
  );
};
