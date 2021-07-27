import { Client } from "discord.js";
import { Package } from "./Packages";

export type ClientMode = "stable" | "canary" | "dev";

export default class Ramos extends Client {

    public prefix: string;
    public mode: ClientMode;
    public packages: Array<Package> = Array<Package>();
    public doDummyOrders: boolean;

    constructor(options: ClientOptions) {
        super();
        this.prefix = options.prefix;
        this.mode = options.mode;
        this.doDummyOrders = options.doDummyOrders;
    }

}

export interface ClientOptions {
    prefix: string,
    mode: ClientMode,
    doDummyOrders: boolean
}
