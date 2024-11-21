import { bskyPostClient } from "./post.ts";
import { bskySearchClient } from "./search.ts";
import { bskyInteractionClient } from "./interactions.ts";
import { IAgentRuntime, Client, elizaLogger } from "@ai16z/eliza";
import { validatebskyConfig } from "./enviroment.ts";
import { ClientBase } from "./base.ts";

class bskyManager {
    client: ClientBase;
    post: bskyPostClient;
    search: bskySearchClient;
    interaction: bskyInteractionClient;
    constructor(runtime: IAgentRuntime) {
        this.client = new ClientBase(runtime);
        this.post = new bskyPostClient(this.client, runtime);
        // this.search = new bskySearchClient(runtime); // don't start the search client by default
        // this searches topics from character file, but kind of violates consent of random users
        // burns your rate limit and can get your account banned
        // use at your own risk
        this.interaction = new bskyInteractionClient(this.client, runtime);
    }
}

export const bskyClientInterface: Client = {
    async start(runtime: IAgentRuntime) {
        await validatebskyConfig(runtime);

        elizaLogger.log("bsky client started");

        const manager = new bskyManager(runtime);

        await manager.client.init();

        await manager.post.start();

        await manager.interaction.start();

        return manager;
    },
    async stop(runtime: IAgentRuntime) {
        elizaLogger.warn("bsky client does not support stopping yet");
    },
};

export default bskyClientInterface;
