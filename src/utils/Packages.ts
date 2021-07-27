export class Package {
    public name: string;
    public desc: string;
    public price: number;
    public items: Array<Item> | undefined;
    public service: string | undefined;
    public aliases: Array<string>;

    constructor(options: PackageOptions) {
        this.name = options.name;
        this.desc = options.desc;
        this.items = options.items || undefined;
        this.service = options.service || undefined;
        this.price = options.price;
        this.aliases = options.aliases
    }

}

export interface PackageOptions {
    name: string,
    desc: string,
    price: number,
    aliases: string[],
    items?: Item[],
    service?: string
}

export class Perk {
    public name: string;
    
    constructor(name: string) {
        this.name = name;
    }
}
