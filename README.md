# 🥞 Robo Frontend

<p align="center">
  <a href="https://roboglobal.info/">
      <img src="https://roboglobal.info//logo.png" height="128">
  </a>
</p>

This project contains the main features of the robob application.

## Documentation

- [Info](doc/Info.md)
- [Cypress tests](doc/Cypress.md)

> Install dependencies using **yarn**

## `apps/web`

<details>
<summary>
How to start
</summary>

```sh
yarn
```

start the development server

```sh
yarn dev
```

build with production mode

```sh
yarn build

# start the application after build
yarn start
```

## </details>

---

<details>
<summary>
How to deploy this project
</summary>

lint style the project

```sh
yarn lint --fix
```

```sh
yarn format:write
```

export this project with production mode

```sh
yarn export
```

deplot to aws

```sh
yarn deploy
```

</details>

The first time clone this source

Please run this script:
-> yarn run prepare

Notes
ADD NETWORK
UPDATE SWAP V2

PRODUCTION
isSupportedChain

ENABLE CHART
TODO
PREVENT SWAP IF THAT'S NOT ROUTE V2

- USD at UserMenuDropdown for balance native
- Estimate Gas Fee
- LP Tokens Received
- research INVALID_SIGNATURE after gatherPermitSignature permit at remove liquidty

api quote uni
'https://api.uniswap.org/v1/'

https://recharts.org/en-US/examples/AreaChartFillByValue

https://tradingview.github.io/lightweight-charts/docs/next/api/interfaces/IChartApi#pricescale

stash color
https://stackoverflow.com/questions/11269256/how-do-i-name-and-retrieve-a-git-stash-by-name

0x97b7E9419de1Db9F1394b52260E5b827d951DA6F

0x2461BA5eb9cC7a130f63Ab3015e3CEFE7bdc4a52,0xB38604ddF8E48e61bd2b17611C0E4D806a756d7a,0x41F188B777a4648526130b3490b27848DF4f8F82,100000000000000000,8582362

0xfc2f2a9973c9c622c295d514a1530afe747afe7a

0x1c0e3a5951a44d4503d5ef9e09e3ccb684b29f4a,0xB38604ddF8E48e61bd2b17611C0E4D806a756d7a,0x41F188B777a4648526130b3490b27848DF4f8F82,100000000000000000,8582362

0x4947a5cac69cb75f65f0fd400fd1715d54a5e337 ETH/RIAN

-> approve with tokenCake and Syrup
-> transferOwnership of tokenCake and syrup to masterchef
-> ADD LP
-> add LP to masterchef
-> approve LP with address masterchef

cake: 0x1c0e3a5951a44d4503d5ef9e09e3ccb684b29f4a
syrupbar: 0x7d7e49EC9Edd9157056691443A0Edf820ab63bBD
masterchef: 0x7D7192548c15C950c60B6f77a143890c0edD18c2
0x1c0e3a5951a44d4503d5ef9e09e3ccb684b29f4a,0x7d7e49EC9Edd9157056691443A0Edf820ab63bBD,0x41F188B777a4648526130b3490b27848DF4f8F82,100000000000000000,8582362

-> cake and syrupbar transferOwnership for masterchef

-> approve lp ETH-RIAN LP with masterchef
-> add lp ETH-RIAN LP: 0x4947a5cac69cb75f65f0fd400fd1715d54a5e337
-> add 1 1

-> approve lp USDC-ETH LP with masterchef
-> add lp ETH-RIAN LP: 0xB70B35188055ec4ED094Cd65d4d622cf50d699c9
-> add 2 1

-> user have to approve with lp they want to farms

0x5fD88882A345FB631cbF1d59245316136a0973A2

// ETH - BUSD
0x9bb4175c7c6deB2A2CB5e9cE9eB490688DE2eEE1 / MC-old
0x0A58cD7612473f0147aD4F686fC0dcdd62079A8F / MC
0xB2757106240d2f04d56970EC498b3f110ad0D946 / erc20

0x44647830988D5243C8EFAC3C803BE8E62CD67Ff6
0x1e5d3FfB811f11AdC63c4780F941b8d2593Fd2c9

0xB70B35188055ec4ED094Cd65d4d622cf50d699c9
