# Booking Hotel App on Solana blockchain

Frontend: NEXT.JS
Backend: Node.JS, Express, Mongodb
Program: Anchor

## Usage

Evertbody can list their property and get profit by sol.

### Flow
- Sign up or sign in with mail and password. You need to connect solana wallet.
- You can find listed properties on homepage. You can make order by clicking item.
  You need to select quantity of rooms, check-in and check-out and click "I'll reserve" button.
  Then sol goes from your wallet to escrow by program.
- To list your own property, you need to click "List your property" button on Navar.
  You need to input informaction such as property type, name, distance, price, quantity, image and so on.
- Owner of propery can accept and reject booking on his property.
  If he accepts it, owner of booking can finalize booking on his profile booking page.
  Then sol on escrow distributed to owner of property and platform owners by info configured on chain.

  If he rejects it, sol on escrow goes back to wallet of booking owner.

### Start(backend)

```terminal
$ cd backend   // go to backend folder
$ npm install  // npm install packages
$ npm run dev  // run it locally
// http://localhost:8000 be available
$ npm run build  // this will build the server code to es5 js codes and generate a dist file
```

### Start(frontend)

```terminal
$ cd frontend   // go to frontend folder
$ npm install   // npm install packages
$ npm run dev   // run it locally
// http://localhost:3000 be available
$ npm run export  // this will build and export to out folder
```

## Author

[Tran Toan](https://github.com/2xsolution)

### License

MIT License
Copyright (C) 2022 @2xSolution <project@2xsolution.com>