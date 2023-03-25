import { Client } from "discord.js";
import Logger from "../helper/Logger";

import commands, { ICommand } from "./CommandsList";

export default class CommandListener {
    static init(
        client: Client,
        HCloudClients: any
    ): Record<string, string | number> {
        try {
            client.on("messageCreate", (msg) => {
                // Check if channel is a text channel
                if (msg.channel.type === "GUILD_TEXT") {
                    // check if it is the right channel
                    if (msg.channel.id == process.env.DISCORD_CHANNEL) {
                        // Loop over all commands
                        commands.forEach((c: ICommand) => {
                            const cmdString: string = msg.content.substring(1);
                            // Check if cmdString and sent message match
                            if (c.functionString.includes(cmdString)) {
                                console.log("test");
                                c.command(msg, HCloudClients, client);
                            }
                        });
                    }
                }
            });
        } catch (err) {
            Logger.error(err as string);
            return {
                status: 0,
                text: "Command Listener could not be initialized",
            };
        }
        return {
            status: 1,
            text: "Command Listener initialized",
        };
    }

    static disable(client: Client): Record<string, string | number> {
        const Listener: any = client.listeners("message");

        let remove;
        Listener.forEach((l: any) => {
            remove = client.removeListener("message", l);
        });

        if (remove)
            return {
                status: 1,
                text: "Command Listener disabled",
            };
        else
            return {
                status: 0,
                text: "Command Listener could not be disabled",
            };
    }
}
