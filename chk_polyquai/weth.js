/* 
https://chk.polyquail.finance

Trades "chk" to WETH on polygon 
*/


module.exports = {
    targetToken: {
        address: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
        proxy: false
    },
    feeMul: 2,
    min_confirmations: 2,
    chainId: 137,
    slippage: 15,
    pool_id: 4,
    farmToken: { address: "0x6116A2A8Ea71890Cf749823Ee9DEC991930a9eEa", proxy: false },
    farmMasterChef: "0x439E9BE4618bfC5Ebe9B7357d848F65D24a50dDE",
    checkPending: "pendingCHK",
    claimFunction: "withdraw",
    claimFunctionFormat: (poolid, address) => {
        return [poolid, 0]
    }
}