import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { SettingsSidebar } from "./sidebar";
import { Separator } from "@/components/ui/separator";
import { OrganizationSettings } from "./organization-settings";
import { ChatModelsSettings } from "./chat-models-settings";
import { TeamMembersSettings } from "./team-members-settings";
import { DatabaseSettings } from "./database-settings";
import { AccessControlSettings } from "./access-control-settings";

interface SettingsModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function Settings({ open, onOpenChange }: SettingsModalProps) {
	const [activeTab, setActiveTab] = useState("organization");

	const renderContent = () => {
		switch (activeTab) {
			case "organization":
				return <OrganizationSettings />;
			case "chat-models":
				return <ChatModelsSettings />;
			case "team-members":
				return <TeamMembersSettings />;
			case "database":
				return <DatabaseSettings />;
			case "access-control":
				return <AccessControlSettings />;
			default:
				return <OrganizationSettings />;
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogTrigger className="w-full cursor-pointer text-left">
				Settings
			</DialogTrigger>
			<DialogContent className="flex h-128 w-[90vw]! max-w-4xl! flex-col gap-0 p-0">
				<div className="p-6 pb-4">
					<DialogTitle className="text-foreground text-2xl">
						Settings
					</DialogTitle>
				</div>
				<Separator />
				<div className="flex flex-1 overflow-hidden">
					<SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />
					<div className="flex-1 overflow-y-auto p-6">{renderContent()}</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
