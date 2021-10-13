module.exports = {
    targetToken: {
        address: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
        proxy: false
    },
    feeMul: 2,
    min_confirmations: 2,
    chainId: 137,
    slippage: 15,
    pool_id: 7,
    farmToken: { address: "0x2ed945Dc703D85c80225d95ABDe41cdeE14e1992", proxy: false },
    farmMasterChef: "0x0451b4893e4a77E7Eec3B25E816ed7FFeA1EBA68",
    checkPending: "pendingSage",
    claimFunction: "withdraw",
    claimFunctionFormat: (poolid, address) => {
        return [poolid, 0]
    }
}