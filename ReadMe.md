# DeStay 

DeStay - Decentralised hotel booking on solana

DeStay eliminates middlemen fees and provides a transparent booking system through smart 
contracts. Additionally both the costumer and the hotel end up paying 0% fees on bookings. 
This means the hotel gets paid a rate they set, and the customer pays 0% hidden fees on the 
booking. Rather, small fees [similar to gas fees] that are 100% transparent would be charged
by the dApps built using DeServe.

https://destay.netlify.app/

## Workflow

![image](https://user-images.githubusercontent.com/98082850/225080605-720cbb4c-4328-4b28-92ae-d722adc5c584.png)


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

Frontend: NEXT.JS
Backend: Node.JS, Express, Mongodb
Program: Anchor
