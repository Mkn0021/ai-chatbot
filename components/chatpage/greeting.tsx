import { motion } from "motion/react";

export const Greeting = () => {
	return (
		<div
			className="mx-auto mt-4 flex size-full max-w-3xl flex-col justify-center px-4 md:mt-16 md:px-8"
			key="overview"
		>
			<motion.div
				animate={{ opacity: 1, y: 0 }}
				className="text-4xl font-bold text-gray-900 md:text-6xl dark:text-white"
				exit={{ opacity: 0, y: 10 }}
				initial={{ opacity: 0, y: 10 }}
				transition={{ delay: 0.5 }}
			>
				Hello
				<span className="text-[#FF7757] dark:text-[#FF8C6B]"> there!</span>
			</motion.div>
			<motion.div
				animate={{ opacity: 1, y: 0 }}
				className="text-2xl text-gray-500 md:text-4xl dark:text-gray-400"
				exit={{ opacity: 0, y: 10 }}
				initial={{ opacity: 0, y: 10 }}
				transition={{ delay: 0.6 }}
			>
				How can I help you today?
			</motion.div>
		</div>
	);
};
