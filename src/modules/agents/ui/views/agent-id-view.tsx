"use client";

import { useSuspenseQuery, useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  agentId: string;
}

export const AgentIdView = ({ agentId }: Props) => {
  const router = useRouter();
  const trpc = useTRPC();
  const [loading, setLoading] = useState(false);

  // Fetch agent details
  const { data } = useSuspenseQuery(
    trpc.agents.getOne.queryOptions({ id: agentId })
  );

  // Remove agent mutation
  const removeAgent = useMutation(
    trpc.agents.remove.mutationOptions({
      onSuccess: () => {
        router.push("/agents");
      },
    })
  );

  const handleRemove = async () => {
    setLoading(true);
    await removeAgent.mutateAsync({ id: agentId });
    setLoading(false);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>{data.name}</h2>
      <p>{data.meetingCount} meeting(s)</p>
      <p>{data.instructions}</p>

      <button
        onClick={handleRemove}
        disabled={loading}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "red",
          color: "white",
          border: "none",
          cursor: "pointer",
          marginTop: "1rem",
        }}
      >
        {loading ? "Removing..." : "Remove Agent"}
      </button>
    </div>
  );
};

export const AgentIdViewLoading = () => <p>Loading agent...</p>;

export const AgentIdViewError = () => <p>Error loading agent.</p>;
