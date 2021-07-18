module.exports = {
    targetToken: {
        address: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
        proxy: "0xdd9185db084f5c4fff3b4f70e7ba62123b812226"
    },
    feeMul: 5,
    min_confirmations: 2,
    interval: 3,
    chainId: 137,
    slippage: 15,
    pool_id: 0,
    farmToken: { address: "0x4a81f8796e0c6ad4877a51c86693b0de8093f2ef", proxy: false }, 
    farmMasterChef: "0x1fd1259fa8cdc60c6e8c86cfa592ca1b8403dfad",
    checkPending: "pendingReward",
    claimFunction: "harvest",
    claimFunctionFormat: (poolid, address) => {
        return [poolid, address]
    }
}
