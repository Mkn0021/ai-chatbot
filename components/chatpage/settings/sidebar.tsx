import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Building2, Database, Lock, Users, Zap } from "lucide-react";

const menuItems = [
	{
		id: "organization",
		label: "Organization",
		icon: Building2,
		description: "Manage details",
	},
	{
		id: "chat-models",
		label: "Chat Models",
		icon: Zap,
		description: "Configure AI models",
	},
	{
		id: "team-members",
		label: "Team Members",
		icon: Users,
		description: "Manage your team",
	},
	{
		id: "database",
		label: "Database",
		icon: Database,
		description: "Connect your database",
	},
	{
		id: "access-control",
		label: "Access Control",
		icon: Lock,
		description: "Manage permissions",
	},
];

interface SettingsSidebarProps {
	activeTab: string;
	onTabChange: (tab: string) => void;
}

export const SettingsSidebar = ({
	activeTab,
	onTabChange,
}: SettingsSidebarProps) => (
	<div className="border-border flex h-full w-12 shrink-0 flex-col overflow-hidden border-r p-1 sm:w-56">
		<SidebarMenu>
			{menuItems.map((item) => {
				const Icon = item.icon;
				const isActive = activeTab === item.id;

				return (
					<SidebarMenuItem key={item.id}>
						<SidebarMenuButton
							isActive={isActive}
							onClick={() => onTabChange(item.id)}
							className="h-auto flex-col items-start gap-1 px-4 py-3"
						>
							<div className="flex w-full items-center justify-center gap-3 sm:justify-start">
								<Tooltip>
									<TooltipTrigger asChild>
										<Icon className="h-5 w-5 shrink-0" />
									</TooltipTrigger>
									<TooltipContent align="start" side="right">
										{item.label}
									</TooltipContent>
								</Tooltip>
								<div className="hidden w-full flex-col items-start justify-start sm:flex">
									<span className="text-sm font-medium">{item.label}</span>
									<span className="text-muted-foreground text-xs">
										{item.description}
									</span>
								</div>
							</div>
						</SidebarMenuButton>
					</SidebarMenuItem>
				);
			})}
		</SidebarMenu>
	</div>
);
