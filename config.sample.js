//sample config
module.exports = {
    targetToken: {
        address: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174", //usdc
        proxy: "0xdd9185db084f5c4fff3b4f70e7ba62123b812226" //usdc proxy
    },
    min_confirmations: 2, //minimum confirmations to wait for
    interval: 25, //claim interval in minutes
    chainId: 137, // chain id, 137 for polygon
    slippage: 15, //slippage in %
    pool_id: 3, //pool you want to claim from
    farmToken: { address: "0x4a81f8796e0c6ad4877a51c86693b0de8093f2ef", proxy: false }, // proxy can be false
    farmMasterChef: "0x1fd1259fa8cdc60c6e8c86cfa592ca1b8403dfad", //farm masterchef
    checkPending: "pendingReward",//function to check pending reward
    claimFunction: "withdraw",// function to claim reward (POOLID,0)
    claimFunctionFormat: (poolid, address) => {
        return [poolid, address] //format the claimFunction should be called with (deconstructs the array later)
    }


}