import { ResponsiveDialog } from "@/components/responsive-dialog";
import { AgentForm } from "./agents-form";
import { AgentGetOne } from "../../types";
import GeneratedAvatar from "@/components/generated-avatar";

interface UpdateAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues:AgentGetOne;
}

export const UpdateAgentDialog = ({
  open,
  onOpenChange,
  initialValues,
}: UpdateAgentDialogProps) => {
  return (
    <ResponsiveDialog
      title="Edit Agent"
      description="Edit agent details"
      open={open}
      onOpenChange={onOpenChange}
    >
      <AgentForm
        
        onSuccess={() => onOpenChange(false)}
        onCancel={() => onOpenChange(false)}
        initialValues={initialValues}
      />
    </ResponsiveDialog>
  );
};
