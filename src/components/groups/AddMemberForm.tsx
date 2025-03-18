
import { useState } from "react";
import { useGroups } from "@/contexts/GroupContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address")
});

type FormData = z.infer<typeof formSchema>;

interface AddMemberFormProps {
  groupId: string;
}

export function AddMemberForm({ groupId }: AddMemberFormProps) {
  const { addMemberByEmail, loading } = useGroups();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ""
    }
  });
  
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await addMemberByEmail(groupId, data.email);
      form.reset();
    } catch (error) {
      console.error("Error adding member:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Member Email</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter email address" 
                  {...field} 
                  disabled={isSubmitting || loading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          disabled={isSubmitting || loading}
          className="w-full"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </form>
    </Form>
  );
}
