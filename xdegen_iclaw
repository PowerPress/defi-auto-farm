/* 
https://iclaws.xdegen.finance/

Trades "ICLAWS" to WETH on polygon 
*/

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
    pool_id: 8,
    farmToken: { address: "0x600a2c125b501e0a477e2c4ad0d9d51c0d6df813", proxy: false },
    farmMasterChef: "0xea1A9Dce0807c5488C8f943b9e571e2b2b680bca",
    checkPending: "pendingToken",
    claimFunction: "withdrawFunds",
    claimFunctionFormat: (poolid, address) => {
        return [poolid, 0]
    }
}
