module.exports = {
    targetToken: {
        address: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
        proxy: "0xdd9185db084f5c4fff3b4f70e7ba62123b812226"
    },
    feeMul: 2,
    min_confirmations: 2,
    chainId: 137,
    slippage: 15,
    pool_id: 1,
    farmToken: { address: "0x6116A2A8Ea71890Cf749823Ee9DEC991930a9eEa", proxy: false },
    farmMasterChef: "0x439E9BE4618bfC5Ebe9B7357d848F65D24a50dDE",
    checkPending: "pendingCHK",
    claimFunction: "withdraw",
    claimFunctionFormat: (poolid, address) => {
        return [poolid, 0]
    }
}