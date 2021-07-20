const axios = require('axios');
const fs = require('fs')
const util = require('util')
const ethers = require('ethers');
const writeFile = util.promisify(fs.writeFile)
const readFile = util.promisify(fs.readFile);

const scanOptions = {
    137: "https://api.polygonscan.com/",
    56: "https://api.bscscan.com/",
    2: "https://api.etherscan.io/",
}

module.exports = (API_KEY, chain_id) => {
    var ABI_CACHE = [];
    async function ContractABI(address) {
        if (ABI_CACHE[address]) return ABI_CACHE[address];
        try {
            if (fs.existsSync(`./contracts/${address}.abi`)) {
                console.log(`[!] Loading ABI of ${address} from Disk`)
                const abi = await readFile(`./contracts/${address}.abi`)
                const contractAbi = JSON.parse(abi);
                ABI_CACHE[address] = contractAbi;
                return contractAbi;
            } else {
                console.log(`[!] Loading ABI of ${address} from Chain`)
                let url = `${scanOptions[chain_id]}/api?module=contract&action=getabi&address=${address}&apikey=${API_KEY}`
                const response = await axios.get(url);

                if (response.data.status == '1') {
                    await writeFile(`./contracts/${address}.abi`, response.data.result)
                    ABI_CACHE[address] = JSON.parse(response.data.result);
                    return ABI_CACHE[address];
                }
                console.log(response);
                return false;
            }
        } catch (error) {
            console.log("error", error);
        }

        return false;
    }

    var CONTRACT_CACHE = [];
    async function Contract(address, signer, proxy = false, abi = false) {
        if (CONTRACT_CACHE[address]) return CONTRACT_CACHE[address];
        this._signer = signer;
        this._contractAddress = address;

        this._contractAbi = abi == false ? await ContractABI(proxy || this._contractAddress) : abi;

        this._contract = new ethers.Contract(this._contractAddress, this._contractAbi, this._signer);


        CONTRACT_CACHE[address] = this._contract;
        return this._contract;
    }

    return Contract;
}
//module.exports = Contract
