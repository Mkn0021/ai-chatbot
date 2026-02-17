"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";

function PasswordInput({
	className,
	type = "password",
	...props
}: React.ComponentProps<"input">) {
	const [showPassword, setShowPassword] = useState(false);

	const inputType = showPassword ? "text" : type;
	const hasValue = !!props.value;

	return (
		<div className="relative">
			<Input
				type={inputType}
				data-slot="input"
				className={className}
				{...props}
			/>
			{hasValue && (
				<button
					type="button"
					onClick={() => setShowPassword(!showPassword)}
					className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
				>
					{showPassword ? (
						<Eye className="size-4" />
					) : (
						<EyeOff className="size-4" />
					)}
				</button>
			)}
		</div>
	);
}

export { PasswordInput };
