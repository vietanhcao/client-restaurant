import { z } from "zod";

const configSchema = z.object({
	NEXT_PUBLIC_API_URL: z.string(),
	NEXT_PUBLIC_URL: z.string(),
});

const configProject = configSchema.safeParse({
	NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
	NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
});

if (!configProject.success) {
	console.error(configProject.error.issues);
	throw new Error("Invalid config");
}

const envConfig = configProject.data;

// todo: env server side config

export default envConfig;
