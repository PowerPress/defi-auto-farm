module.exports = {
    targetToken: {
        address: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
        proxy: false
    },
    feeMul: 2,
    min_confirmations: 2,
    chainId: 137,
    slippage: 15,
    pool_id: 0,
    farmToken: { address: "0x88a3acac5c48f93121d4d7771a068a1fcde078bc", proxy: false },
    farmMasterChef: "0x4696b1a198407bfb8bb8dd59030bf30fac258f1d",
    checkPending: "pendingReward",
    claimFunction: "withdraw",
    claimFunctionFormat: (poolid, address) => {
        return [poolid, 0]
    }
}