module.exports = {
    targetToken: {
        address: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
        proxy: "0xdd9185db084f5c4fff3b4f70e7ba62123b812226"
    },
    feeMul: 5,
    min_confirmations: 2,
    interval: 15,
    chainId: 137,
    slippage: 15,
    pool_id: 8,
    farmToken: { address: "0xaa9654becca45b5bdfa5ac646c939c62b527d394", proxy: "0x6548fef3fd79e93b0098f7eea8172290240842f6" },
    farmMasterChef: "0x1948abc5400aa1d72223882958da3bec643fb4e5",
    checkPending: "pendingDino",
    claimFunction: "deposit",
    claimFunctionFormat: (poolid, address) => {
        return [poolid, 0]
    }
}