
const ethers = require('ethers');
const { formatEther, hexlify } = ethers.utils;
const axios = require('axios');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

module.exports = function (API_KEY, wallet, provider, MIN_CONFIRMATIONS, chain_id) {


    const Contract = require("./contract_ethers.js")(API_KEY,chain_id);

    const prettifyTx = (txData) => {
        return {
            nonce: txData.nonce,
            gasPrice: formatEther(txData.gasPrice),
            gasLimit: formatEther(txData.gasLimit),
            to: txData.to,
            value: formatEther(txData.value),
            data: txData.data.substring(0, 256),
            chainId: txData.chainId,
            from: txData.from,
            hash: txData.hash,
            wait: txData.wait
        }
    }
    var allowanceCache = [];
    const approve = async (contract_address, contract_proxy_address = false, address, amount) => {
        try {
            console.log("[?] approve", contract_address);
            if (allowanceCache[contract_address + "_" + address] && allowanceCache[contract_address + "_" + address].gte(amount)) {
                return true;
            }



            const ownerAddress = await wallet.getAddress();
            const tContract = await Contract(contract_address, wallet, contract_proxy_address);
            const allowance = await tContract.allowance(ownerAddress, address)
            console.log("[?] Allowance", formatEther(allowance));
            if (allowance.gte(amount)) {
                allowanceCache[contract_address + "_" + address] = allowance;
                console.log("[!] Already approved");
                return true;
            }

            const newAllowance = amount.mul(5000).div(100);
            let gasLimit = await tContract.estimateGas.approve(address, newAllowance);
            let gasPrice = await provider.getGasPrice();

            console.table({ "gasPrice": gasPrice.mul(2).toNumber(), "gasLimit": gasLimit.mul(2).toNumber() })
            const tx = await tContract.approve(
                address,
                newAllowance,
                {
                    gasPrice: gasPrice.mul(2),
                    gasLimit: gasLimit.mul(2),
                    //chainId: chain_id
                }
            );
            //console.log("tx", tx)
            console.log("[!] Waiting for confirmations on approval", tx.hash);
            await tx.wait(MIN_CONFIRMATIONS);
            console.log("[!] Approved");
            return tx;
        } catch (error) {
            console.log(error);
            return false;
        }
    };


    // Using 1inch


    async function getSpender() {

        let tries = 0;
        let result = undefined;
        do {
            try {
                tries++;
                console.log(`[!] 1inch getSpender attempt #${tries}`)
                let temp = await axios.get(`https://api.1inch.exchange/v3.0/${chain_id}/approve/spender`);
                if (temp.data) {
                    result = temp.data;
                }
            } catch (error) {
                console.error("GetSpender", error);
            }
            await delay(5000);
        } while (tries < 5 && result == undefined)
        if (result == undefined) return false;

        return result;
    }
    async function getRoute(tokenIn, tokenOut, amountTokenIn, slippage) {
        const address = await wallet.getAddress();
        let tries = 0;
        let result = undefined;
        do {
            try {
                tries++;
                console.log(`[!] 1inch getRoute attempt #${tries}`)
                let url = `https://api.1inch.exchange/v3.0/${chain_id}/swap?fromTokenAddress=${tokenIn}&toTokenAddress=${tokenOut}&amount=${amountTokenIn}&fromAddress=${address}&slippage=${slippage}&disableEstimate=true`;
                let temp = await axios.get(url);
                if (temp.data) {
                    result = temp.data;
                }
            } catch (error) {
                console.error("getRoute", error);
            }
            await delay(5000);

        } while (tries < 5 && result == undefined)
        if (result == undefined) return false;

        return result;
    }
    const swapTokenForToken = async (tokenIn, tokenInProxy = false, tokenOut, amountTokenIn, customGas, slippage = 1) => {
        const address = await wallet.getAddress();

        let agg = await getRoute(tokenIn, tokenOut, amountTokenIn, slippage);//await axios.get(url);

        let spender = await getSpender();
        const approved = await approve(tokenIn, tokenInProxy, spender.address, amountTokenIn);
        if (agg && approved) {
            let data = agg.tx;
            delete data.gasPrice;
            delete data.gas;
            data.value = "0x0";
            //data.chainId = chain_id;
            if (customGas) {
                console.table({ "gasPrice": customGas.gasPrice.toNumber(), "gasLimit": customGas.gasLimit.toNumber() })
                Object.assign(data, customGas)
            }
            console.log("[!] Sending Swap to 1inch")
            let tx = await wallet.sendTransaction(data);
            console.log("[!] Swap", prettifyTx(tx))
            await tx.wait(MIN_CONFIRMATIONS);
            return { tx, agg };
        }
        return false;
    }
    return { approve, swapTokenForToken, getRoute, getSpender };
}
