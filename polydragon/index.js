module.exports = {
    targetToken: {
        address: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
        proxy: false
    },
    feeMul: 2,
    min_confirmations: 2,
    interval: 15,
    chainId: 137,
    slippage: 25,
    pool_id: 5,
    farmToken: { address: "0x0b502860b730bfaf5fa5566ec9996c53810dfe08", proxy: false },
    farmMasterChef: "0x36caee4b022f5a0f5ce31fdb7fdf45498e8b2678",
    checkPending: "pendingSh",
    claimFunction: "claim",
    claimFunctionFormat: (poolid, address) => {
        return [poolid]
    }
}