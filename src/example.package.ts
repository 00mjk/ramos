import * as Ramos from './utils';

const packages: Array<Ramos.Package> = [
    new Ramos.Package({ name: "Package 1", desc: "First package", price: 1, aliases: ["one", "first"], items: [
        new Ramos.Perk("Perk"),
    ] }),
    new Ramos.Package({ name: "Package 2", desc: "Second package", price: 2, aliases: ["two", "second"], items: [
        new Ramos.Perk("Perk"),
    ] }),
]

export default packages;
