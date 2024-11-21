import { IAgentRuntime } from "@ai16z/eliza";
import { z } from "zod";

export const BSKYEnvSchema = z.object({
    BSKY_DRY_RUN: z
        .string()
        .transform((val) => val.toLowerCase() === "true"),
    BSKY_USERNAME: z.string().min(1, "BSKY username is required"),
    BSKY_PASSWORD: z.string().min(1, "BSKY password is required"),
    BSKY_EMAIL: z.string().email("Valid BSKY email is required"),
    BSKY_COOKIES: z.string().optional(),
});

export type BSKYConfig = z.infer<typeof BSKYEnvSchema>;

export async function validateBSKYConfig(
    runtime: IAgentRuntime
): Promise<BSKYConfig> {
    try {
        const config = {
            BSKY_DRY_RUN:
                runtime.getSetting("BSKY_DRY_RUN") ||
                process.env.BSKY_DRY_RUN,
            BSKY_USERNAME:
                runtime.getSetting("BSKY_USERNAME") ||
                process.env.BSKY_USERNAME,
            BSKY_PASSWORD:
                runtime.getSetting("BSKY_PASSWORD") ||
                process.env.BSKY_PASSWORD,
            BSKY_EMAIL:
                runtime.getSetting("BSKY_EMAIL") ||
                process.env.BSKY_EMAIL,
            BSKY_COOKIES:
                runtime.getSetting("BSKY_COOKIES") ||
                process.env.BSKY_COOKIES,
        };

        return BSKYEnvSchema.parse(config);
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorMessages = error.errors
                .map((err) => `${err.path.join(".")}: ${err.message}`)
                .join("\n");
            throw new Error(
                `BSKY configuration validation failed:\n${errorMessages}`
            );
        }
        throw error;
    }
}
