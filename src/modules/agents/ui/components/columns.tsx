"use client"

import { ColumnDef } from "@tanstack/react-table"
import { AgentGetOne } from "../../types"
import GeneratedAvatar from "@/components/generated-avatar";
import { Badge } from '@/components/ui/badge';
// If VideoIcon is not imported, add the import statement below:
import { VideoIcon } from 'lucide-react'; // or wherever VideoIcon is defined

export const columns: ColumnDef<AgentGetOne>[] = [
  {
    accessorKey: "name",
    header: "Agent name",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-3">
        <GeneratedAvatar
          seed={row.original.name}
          variant="bottts"
          size={32}
          className="rounded-full"
        />
        <div>
          <span className="text-sm font-medium text-gray-800">
            {row.original.name}
          </span>
          <div className="text-xs text-gray-500">
            {row.original.instructions}
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "meetingCount",
    header: "Meetings",
    cell: () => (
      <Badge
      variant="outline"
      className="flex items-center gap-x-2 [&>svg]:size-4">
        {/* Make sure VideoIcon is imported above */}
        <VideoIcon className="text-blue-700" />
        5 meetings
              </Badge>
    ),
  },
]
