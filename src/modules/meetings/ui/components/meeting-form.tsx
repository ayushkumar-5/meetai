import React from "react";
import { z } from "zod";
// import { useRouter } from "next/navigation";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import GeneratedAvatar from "@/modules/agents/ui/components/generated-avatar";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MeetingGetOne } from "../../types";
import { useState } from "react";
import { meetingsInsertSchema } from "../../schemas";
interface MeetingFormProps {
  onSuccess?: (id?:string) => void;
  onCancel?: () => void;
  initialValues?: MeetingGetOne;
}
import { CommandSelect } from "@/components/command-select";


export const MeetingForm = ({ onSuccess, onCancel, initialValues }: MeetingFormProps) => {
  const trpc = useTRPC();
  //   const router = useRouter();
  const [agentSearch, setAgentSearch] = useState("");
  const [open,setOpen] = useState(false);
  const queryClient = useQueryClient();
  const agents= useQuery(
    trpc.agents.getMany.queryOptions({
      pageSize:100,
      search:agentSearch,
    }),
  );
  const isEdit = !!initialValues?.id;
  const createMeeting = useMutation(
    trpc.meetings.create.mutationOptions({
      onSuccess: async (data) => {
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({}),
        );
        onSuccess?.(data.id);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const updateMeeting = useMutation(
    trpc.meetings.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({}),
        );
        if (initialValues?.id) {
          await queryClient.invalidateQueries(
            trpc.meetings.getOne.queryOptions({ id: initialValues.id }),
          );
        }
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const form = useForm<z.infer<typeof meetingsInsertSchema>>({
    resolver: zodResolver(meetingsInsertSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      agentId: initialValues?.agentId ?? "",
    },
  });

  const isPending = createMeeting.isPending || updateMeeting.isPending;

  const onSubmit = (values: z.infer<typeof meetingsInsertSchema>) => {
    if (isEdit) {
      updateMeeting.mutate({ ...values, id: initialValues.id });
    } else {
      createMeeting.mutate(values);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex items-center gap-4">
          
        </div>

        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. Team Building Workshop" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

<FormField
  name="agentId"
  control={form.control}
  render={({ field }) => (
    <FormItem>
      <FormLabel>Agent</FormLabel>
      <FormControl>
      <CommandSelect
  value={field.value}
  onSelect={field.onChange}
  options={(agents.data?.items ?? []).map((agent) => ({
    id: agent.id,
    value: agent.id,
    searchValue: agent.name,
    children: (
      <div className="flex items-center gap-x-2">
        <GeneratedAvatar
          seed={agent.name}
          variant="bottts"
          size={20}
          className="rounded-sm border overflow-hidden"
        />
        <span className="text-[13px] leading-none">{agent.name}</span>
      </div>
    ),
  }))}
onSearch={setAgentSearch}
placeholder="Select an agent"
/>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

        <div className="flex gap-2">
          <Button type="submit" disabled={isPending}>
            {isEdit ? "Update" : "Create"}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};
