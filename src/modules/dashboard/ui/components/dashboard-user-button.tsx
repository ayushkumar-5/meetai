import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { authClient } from '@/lib/auth-client';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import GeneratedAvatar from '@/components/generated-avatar';
import { ChevronDownIcon, CreditCard, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const DashboardUserButton = () => {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();

  if (isPending || !data?.user) {
    return null;
  }

  const handleBilling = () => {
    router.push("/upgrade");
  };

  const onLogout = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
        }
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="rounded-lg border border-border/10 p-3 w-full flex items-center gap-3 bg-white/5 hover:bg-white/10 overflow-hidden transition-colors"
      >
        {data.user.image ? (
          <Avatar className="h-10 w-10">
            <AvatarImage src={data.user.image} alt={data.user.name || 'User'} />
          </Avatar>
        ) : (
          <GeneratedAvatar 
            seed={data.user.email || data.user.name || 'user'} 
            size={40} 
            className="h-10 w-10 rounded-full"
          />
        )}
        
        <div className="flex-1 text-left min-w-0">
          <div className="font-medium text-sm truncate text-gray-500">
            {data.user.name || 'User'}
          </div>
          <div className="text-xs text-muted-foreground truncate">
            {data.user.email}
          </div>
        </div>
        
        <ChevronDownIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-56"
        sideOffset={5}
      >
        <DropdownMenuItem 
          onClick={handleBilling}
          className="cursor-pointer"
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Billing
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={onLogout}
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};