import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { PanelLeft } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function SidebarToggle({ className }: { className?: string }) {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<SidebarTrigger className={cn("h-8 px-2 md:h-fit md:px-2", className)}>
					<PanelLeft size={16} />
				</SidebarTrigger>
			</TooltipTrigger>
			<TooltipContent align="start" className="hidden md:block">
				Toggle Sidebar
			</TooltipContent>
		</Tooltip>
	);
}
