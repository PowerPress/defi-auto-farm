
module.exports = {
    targetToken: {
        address: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
        proxy: false
    },
    feeMul: 2,
    min_confirmations: 2,
    interval: 15,
    chainId: 137,
    slippage: 15,
    pool_id: 13,
    farmToken: { address: "0x2f535aE1A9f6405E9e6E2Ff10FdEd846358a5C39", proxy: false },
    farmMasterChef: "0x21BE35019F1b2C89Baab802fbA72F20b25435087",
    checkPending: "pendingLibra",
    claimFunction: "withdraw",
    claimFunctionFormat: (poolid, address) => {
        return [poolid, 0]
    }
}