/* Trades "WISE" to WETH on polygon */

module.exports = {
    targetToken: {
        address: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
        proxy: false
    },
    feeMul: 3,
    min_confirmations: 2,
    interval: 15,
    chainId: 137,
    slippage: 15,
    pool_id: 5,
    farmToken: { address: "0x4c19ddeebaf84ca3a255730295ad9d824d4ff51f", proxy: false },
    farmMasterChef: "0x62ba727e2449ee3be0573b4b102d7090c5977bfb",
    checkPending: "pendingWise",
    claimFunction: "withdraw",
    claimFunctionFormat: (poolid, address) => {
        return [poolid, 0]
    }
}
