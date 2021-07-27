<div align="center">
  <img src="https://i.imgur.com/vfliY0x.png" width="100"> </img>
</div>
<h2 align="center">Ramos: an open-source bot for creating shopping packages in your Discord community</h2>
  
<hr />
  
## About Ramos
Ramos is developed & maintained by hanatic, plus the help of anyone else who turns up (see image below. Just the concept of it has gone through many revisions: it first began as a project called Hyview, working with the Hypixel API to create a platfrom like [HyAuctions](https://auctions.craftlink.xyz), which was later abandoned (because I just cannot work out how to use hooks in React - it's my one flaw). This then evolved into a theorised platform to make purchasable packages on Hypixel Skyblock that could be purchased through Discord. Financial troubles intervened and I decided to open source the code. Not quite finished yet though, a few features need polishing and I definitely plan to expand it.

## Contributors  
<a href="https://github.com/hanatic/ramos/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=hanatic/ramos" />
</a>

## Prerequisites
- A Discord account
- A Discord bot token (can be obtained via https://discord.com/developers/applications), with the bot added to a server you are on
- Git installed locally
- NPM installed locally
- TSC && TS-node installed locally (`npm i tsc ts-node -g`)

## Installing

1: Clone the git repository and enter it in your terminal
```
git clone https://github.com/hanatic/ramos
cd ramos
```

2: Add your token to line 10 of the src/index.ts

```js
// ...
import packages from './package';

/* put it here >>> */ var token = "YOUR_TOKEN_HERE";
// ...
```

3: (optional) Install `ts-node-dev` - this helps you reload the TypeScript code - useful if you plan to edit it.
```
npm i -g ts-node-dev
```

4: Run the app: if you installed ts-node-dev:
  ```
  npm run dev
  ```
If you didn't:
  ```
  ts-node src/index.ts
  ```
  
5: Make sure it's working: you should get console output like this (tag will be different)
```
Ramos#6914 has logged in using Ramos.
```

## Support
Join our discord: https://discord.gg/ySbSesFNB5
