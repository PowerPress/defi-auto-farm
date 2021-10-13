module.exports = {
    targetToken: {
        address: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
        proxy: "0xdd9185db084f5c4fff3b4f70e7ba62123b812226"
    },
    feeMul: 2,
    min_confirmations: 2,
    chainId: 137,
    slippage: 15,
    pool_id: 	19,
    farmToken: { address: "0x2ed945Dc703D85c80225d95ABDe41cdeE14e1992", proxy: false },
    farmMasterChef: "0x0451b4893e4a77E7Eec3B25E816ed7FFeA1EBA68",
    checkPending: "pendingSage",
    claimFunction: "withdraw",
    claimFunctionFormat: (poolid, address) => {
        return [poolid, 0]
    }
}