To run the frontend:

```
cd frontend
npm run dev
```

Hardhat scripts:

```
cd contract
npx hardhat compile
npx hardhat run src/deploy.js
```

If you have modified the contract, you will need to copy the contract artifact, eg `contract/artifacts/NFT_ETF.sol/NFT_ETF.json` into the `frontend/contracts` folder.
