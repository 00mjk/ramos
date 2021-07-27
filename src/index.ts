import * as Discord from 'discord.js';
import * as Ramos from './utils'
import mongoose from 'mongoose'
import chalk from 'chalk';
import { v4 as uuidv4 } from 'uuid';
import { PagesBuilder } from 'discord.js-pages';
import packages from './package';

var token = "YOUR_TOKEN_HERE";

import Order from './models/Order';

const client: Ramos.Client = new Ramos.Client({ prefix: "!!", mode: "dev", doDummyOrders: true});

mongoose.connect("YOUR_MONGO_URL", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

client.login(token);

client.on('ready', () => {
    if (client?.user?.tag) {
        console.log(`${client.user.tag} has logged in using Ramos.`);
    } else {
        console.log(`"Bot" has logged in using Ramos.`);
    }
});

client.on('message', async (message: Discord.Message) => {

    if (!message.content.startsWith(client.prefix) || message.author.bot) return;

	const args: string[] = message.content.slice(client.prefix.length).trim().split(' ');
	const command = args.shift()?.toLowerCase()!;

    /**
     * The below commands are for use by default users.
     */

    if (command === "help") {
        new PagesBuilder({message: message})
        .setPages([
            new Discord.MessageEmbed()
                .setTitle("Commands: Packages")
                .setDescription("Here are some commands relating to our packages system.")
                .addFields(
                    { name: "packages", value: "Lists all packages" },
                    { name: "package", value: "Use `!!package view {name}` to view a package or `!!package buy {name}` to purchase one for the given price." }

                )
                .setColor("ORANGE"),
                new Discord.MessageEmbed()
                .setTitle("Commands: Orders")
                .setDescription("Here are some commands relating to package orders.")
                .addFields(
                    { name: "vieworder", value: "Views the status of a specific order (Order ID must be supplied as a parameter)" },
                    { name: "cancelorder", value: "Cancels a specific order and refunds any payments given so far (Order ID must be supplied as a parameter)" }

                )
                .setColor("BLURPLE"),
                new Discord.MessageEmbed()
                    .setTitle("Commands: Orders [Staff]")
                    .setDescription("Here are some commands for staff relating to orders.")
                    .addFields(
                        { name: "nextphase / np", value: "Allows you to move an order to the next phase of delivery (Order ID must be supplied as a parameter)" },
                        { name: "refuse / or", value: "Allows staff members to refuse orders with a given reason (Order ID must be supplied as a parameter)" },
                        { name: "contactcustomer / cc", value: "Allows staff members to contact the customer of a particular order (Order ID must be supplied as a parameter)" },
                        { name: "ordermeta / om", value: "Allows staff members to view an order's metadata (Order ID must be supplied as a parameter)" },
                    )
                    .setColor("DARK_VIVID_PINK"),
        ])
        .build();
    }

    else if (command === "packages") {
        const embed = new Discord.MessageEmbed()
            .setTitle("Here are our packages:")
            .setDescription("You can view specific packages using !!package view {first word of name}")
            .setColor(Ramos.Constants.ColorCodes.Info)
        
        packages.map(thisPackage => {
            embed.addFields(
                { name: thisPackage.name, value: thisPackage.desc}
            )
        })

        message.channel.send(embed);
    }

    else if (command === "package") {

        if (args[0] === "view") {
            const requestedPackage = packages.find(target => target.aliases.find(alias => alias === args[1].toLowerCase()));

            if (requestedPackage) {
                const embed = new Discord.MessageEmbed()
                    .setTitle(`${requestedPackage.name}`)
                    .setColor(Ramos.Constants.ColorCodes.Info)
                    .addFields(
                        { name: "Items included:", value: requestedPackage?.items?.map((item: Ramos.Item) => `- ${item.name}`) ?? "null" }
                    )

                message.channel.send(embed)
            } else {
                const embed = new Discord.MessageEmbed()
                    .setTitle(`404: We couldn't find this package`)
                    .setColor(Ramos.Constants.ColorCodes.Danger)
                    .setFooter(`ERROR_PACKAGE_DOES_NOT_EXIST`)

                message.channel.send(embed);
            }

        }

        else if (args[0] === "buy") {
            const requestedPackage = packages.find(target => target.aliases.find(alias => alias === args[1].toLowerCase()));

            if (requestedPackage) {
                await message.reply(`you're about to order 1x ${requestedPackage.name}. React with :thumbsup: or :thumbsdown:`).then(botMsg => {
                    botMsg.react('👍').then(r => {
                        botMsg.react('👎');
                    });

                    botMsg.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '👍' || reaction.emoji.name == '👎'),
                            { max: 1, time: 30000 }).then(async collected => {
                                if (collected !== undefined) {
                                    if (collected.first()?.emoji.name == '👍') {
                                        await message.channel.send('Sending a request to our database...').then(async okMsg => {

                                            if (requestedPackage) {
                                                let toggle: boolean;
                                                if (client.doDummyOrders === true) {
                                                    toggle = true
                                                } else {
                                                    toggle = false
                                                }

                                                await Order.create({
                                                    id: uuidv4(),
                                                    customerid: message.author.id,
                                                    purchased: requestedPackage.name,
                                                    state: "ordered",
                                                    dummy: toggle
                                                }).then(order => {
                                                    console.log("done")
                                                    okMsg.edit(new Discord.MessageEmbed({ title: "Order created!", description: `Your order has been dispatched to the Hyview team. Your Order ID is ${order.id}`, color: Ramos.Constants.ColorCodes.Success }))
                                                }).catch(e => {
                                                    okMsg.edit("An error has occured. This is most likely because the record's UUID is invalid. Retrying this will fix it in 99.9% of cases.")
                                                })

                                            }

                                        })
                                    }
                                    else {
                                        message.channel.send('Okay, I won\'t order this package for you.');
                                    }
                                } else {
                                    message.reply("congratulations! Somehow you've managed to break our code and make our bot collect a non existent value. Would you mind reporting this to the dev team? thanks :)")
                                }
                            }).catch(() => {
                                    message.reply('No reaction after 30 seconds, operation canceled');
                            });

                })
            } else {

            }
        }

    }

    else if (command === "vieworder") {

        if (args[0]) {

            await Order.findOne({ id: args[0].trim(), refused: undefined || false }).then((asset: any) => {
                if (asset === undefined) {
                    console.log(chalk.red("uh oh stinky: the database returned an undefined record"))
                } else {
			if (asset.state === "cancelled") {
			    const embed = new Discord.MessageEmbed()
				    .setTitle("This order has been cancelled.)
				    .setColor(Ramos.Constants.ColorCodes.Danger)

			    message.channel.send(embed)
			} else {
			    const embed = new Discord.MessageEmbed()
				    .setTitle("Your order of " + asset.purchased)
				    .setDescription(`Your order is in the \`${asset.state}\` phase.`)
				    .setColor(Ramos.Constants.ColorCodes.Success)

			    message.channel.send(embed)
			}
                }
            }).catch((e: any) => {
                console.log(chalk.red("uh oh stinky: " + e))
            });


        } else {

            await message.channel.send("No ID given, listing all orders...").then(async original => {

                await Order.find({ customerid: message.author.id, refused: undefined || false }).then((orders: any[]) => {
                    const embed = new Discord.MessageEmbed()
                        .setTitle("Here's all your orders")
                        .setColor(Ramos.Constants.ColorCodes.Success);
        
                    orders.map(order => {
                        embed.addFields(
                            { name: `${order.id}`, value: order.purchased}
                        )
                    })
        
                    message.channel.send(embed)
                }).then(() => {
                    original.delete();
                })

            })

        }

    }
	
    else if (command === "cancelorder") {
	
        const order = await Order.findOne({ id: args[0] })

        order.state = "cancelled"

        await order.save().then((newOrder: any) => {
            message.reply("this order was succesfully cancelled ")
        })
	    
    }

    /**
     * The below commands are for use by staff users only.
     */

    else if (command === "nextphase" || command === "np") {

        const order = await Order.findOne({ id: args[0] })

        order.state = nextState(order.state);

        await order.save().then((newOrder: any) => {
            message.reply("this order has been moved into state: " + newOrder.state)
        })

    }

    else if (command === "refuse" || command === "or") {
        const order = await Order.findOne({ id: args[0]})

        const customer = client.users.cache.get(order.customerid);

        customer?.send(new Discord.MessageEmbed({ title: `Your order for ${order.purchased} was refused`, description: `The Hyview staff team refused your order. Try ordering again, or open a ticket to ask our staff team out why your order was refused.`, footer: order.id, color: Ramos.Constants.ColorCodes.Danger  }))

        order.refused = true;

        await order.save().then(() => {
            message.channel.send(`Order ${order.id} was refused and marked as refused in database`);
        })

    }

    else if (command === "contactcustomer" || command === "cc") {
        
        const order = await Order.findOne({ id: args[0]})

        const customer = client.users.cache.get(order.customerid);

        if (customer) {
            
        } else {
            message.channel.send(new Discord.MessageEmbed({ title: "Customer could not be found", description: "Make sure you didn't make a mistake in the order ID.", color: Ramos.Constants.ColorCodes.Danger }))
        }
    }

});

function nextState(state: String)  {

    switch (state) {
        case "ordered": 
            return "recieved";
            break;
        case "recieved":
            return "fulfilled";
            break;
        case "fulfilled":
            return "dispatched";
            break;
        case "dispatched":
            return "complete";
            break;
        case "complete":
            return "end";
            break;
        case "end":
            return "end";
            break;
    }
    
}
