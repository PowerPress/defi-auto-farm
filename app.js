const ethers = require('ethers');
const BN = ethers.BigNumber;
const { formatEther } = ethers.utils;
const { WeiPerEther } = ethers.constants;
const {
    Webhook
} = require('discord-webhook-node');

const formatCustom = (units, base) => units / base;
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

if (!process.argv[2]) {
    console.log("[!] Please pass a config file")
    process.exit(1);
}
const configPath = process.argv[2];
const config = require(configPath);
const privateConfig = require("./creds.js");
if (!privateConfig.privateKey) {
    console.log("[!] Please setup creds.js")
    process.exit(1);
}

if (config.farmToken.address == undefined) {
    console.log("Specify farm token: {address:'',proxy:''}")
    process.exit(1);
}
if (config.targetToken.address == undefined) {
    console.log("Specify target token: {address:'',proxy:''}")
    process.exit(1);
}


const claimInterval = config.interval;
console.log(`[!!] Claim interval ${claimInterval}min`)
const Contract = require("./libs/contract_ethers.js")(privateConfig.polygonscan);
const discordHook = privateConfig.discordWebHook !== undefined ? new Webhook(privateConfig.discordWebHook) : false;
//Specifics
const MIN_CONFIRMATIONS = config.min_confirmations;
const chainId = config.chainId;
//Generic Token Contracts
const FeeMultiplier = config.feeMul;
//Project Specific Contracts
const SLIPPAGE = config.slippage;
const POOL_ID = config.pool_id;

const MasterChefAddress = config.farmMasterChef; //MasterChef;

const RPC_URL = privateConfig.rpcUrl;
const provider = (RPC_URL.indexOf("wss://") == -1) ? new ethers.providers.JsonRpcProvider(RPC_URL, chainId) : new ethers.providers.WebSocketProvider(RPC_URL, chainId)

let wallet = new ethers.Wallet(privateConfig.privateKey)
wallet = wallet.connect(provider);
const Token = require("./libs/token.js")(privateConfig.polygonscan, wallet, provider, MIN_CONFIRMATIONS, chainId);
var txConfirmations = [];

var LOOP_BUSY =
    (async () => {
        console.log("[*] Start")
        const address = await wallet.getAddress();
        console.log("[*] Address", address)

        const TargetTokenInterface = await Contract(config.targetToken.address, wallet, config.targetToken.proxy || false);
        const TargetTokenName = await TargetTokenInterface.symbol();
        const TargetTokenDecimals = await TargetTokenInterface.decimals();

        const MasterChefInterface = await Contract(MasterChefAddress, wallet);
        const TokenInterface = await Contract(config.farmToken.address, wallet, config.farmToken.proxy || false);
        const TokenFarmName = await TokenInterface.symbol();

        const FormatBasis = "1" + Array.from({ length: TargetTokenDecimals }).map((e, i) => "0").join("");
        console.log("[!] Target Token")
        console.table({ symbol: TargetTokenName, base: FormatBasis })

        console.log(`[!!] Farm Token`)
        console.table({ symbol: TokenFarmName })
        const poolInfo = await MasterChefInterface.poolInfo(POOL_ID);
        console.log("[?] depositFee", poolInfo.depositFeeBP / 100 + "%")
        console.log("[?] Max Slippage", SLIPPAGE + "%")
        const claimReward = async () => {
            const fastGas = await provider.getGasPrice();
            const beforeClaimBalance = await TokenInterface.balanceOf(address);
            console.log("[!] Before ClaimReward", formatEther(beforeClaimBalance))

            const userInfo = await MasterChefInterface.userInfo(POOL_ID, address);
            console.log("[!] rewardDebt", formatEther(userInfo.rewardDebt.toString()))
            console.log("[!] Staked", formatEther(userInfo.amount.toString()))

            const pendingReward = await MasterChefInterface[config.checkPending](POOL_ID, address);
            console.log("[!] pendingReward", formatEther(pendingReward))
            if (pendingReward.gt(0) || beforeClaimBalance.gt(WeiPerEther.div(100))) {
                try {
                    if (pendingReward.gt(0)) {
                        console.log("[!] est. gas price", fastGas.toString())
                        console.log("[!] Claiming Reward")
                        const gas = {
                            gasLimit: BN.from("10000000"),
                            gasPrice: fastGas.mul(FeeMultiplier),

                        };
                        console.table({ gasLimit: gas.gasLimit.toString(), gasPrice: gas.gasPrice.toString() })
                        try {
                            if (config.claimFunctionFormat == undefined) {
                                config.claimFunctionFormat = (pool, address) => {
                                    return [pool, 0]
                                }
                            }
                            const d = config.claimFunctionFormat(POOL_ID, address);
                            const reward = await MasterChefInterface[config.claimFunction](...d, gas);

                            console.log(`[!] Claim ${reward.hash}`)
                            await reward.wait(MIN_CONFIRMATIONS);
                            if (txConfirmations[reward.hash]) throw Error("[?] TX already confirmed")
                            txConfirmations[reward.hash] = true;

                            console.log("[?] Confirmed?")
                            await delay(MIN_CONFIRMATIONS * 1000);
                        } catch (error) {
                            return console.error("[!] Claim error", error);
                        }
                    }
                    const balance = await TokenInterface.balanceOf(address);
                    console.log("[!] New Balance", formatEther(balance))

                    if (!balance.gt(0)) throw Error("[!] Balance 0")
                    const swap = await Token.swapTokenForToken(config.farmToken.address, config.farmToken.proxy, config.targetToken.address, balance, {
                        gasLimit: BN.from("10000000"),
                        gasPrice: fastGas.mul(FeeMultiplier),
                    }, SLIPPAGE);
                    if (!swap) throw Error("[?] Swap Failed");
                    const msg = `[!] Swapped ${Number(formatEther(swap.agg.fromTokenAmount)).toFixed(6)} ${TokenFarmName} to ${formatCustom(swap.agg.toTokenAmount, FormatBasis)} ${TargetTokenName} TX:${swap.tx.hash}`;
                    console.log(msg)
                    if (discordHook) {
                        discordHook.send(msg);
                    }
                } catch (error) {
                    console.error(error)
                    if (error.code != undefined && error.code == "NETWORK_ERROR") {
                        console.log("[!!!] NETWORK_ERROR")
                        return false;
                    }
                    if (error.code != undefined && error.code == "TRANSACTION_REPLACED") {
                        console.log("[!!!] Transaction replaced")
                        return false;
                    }
                }
            } else {
                console.log("[!] Nothing to claim")
            }
            console.log(`[!] waiting for ${claimInterval}min...`)

            console.log("#######################")
            return true;
        };
        await claimReward()
        setInterval(claimReward, claimInterval * 60 * 1000)

    })();

