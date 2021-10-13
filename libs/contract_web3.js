const axios = require('axios');

const fs = require('fs')
const util = require('util')
const EventEmitter = require("./events.js")
const writeFile = util.promisify(fs.writeFile)
const stat = util.promisify(fs.stat);
const readFile = util.promisify(fs.readFile);
const Web3 = require('web3');



const API_KEY = 'APIKEY'
async function ContractABI(address) {
    if (fs.existsSync(`./contracts/${address}.abi`)) {
        console.log(`[!] Loading ABI of ${address} from Disk`)
        const abi = await readFile(`./contracts/${address}.abi`)
        const contractAbi = JSON.parse(abi);
        return contractAbi;
    } else {
        console.log(`[!] Loading ABI of ${address} from Chain`)
        let url = `https://api.polygonscan.com/api?module=contract&action=getabi&address=${address}&apikey=${API_KEY}`
        const response = await axios.get(url);

        if (response.data.status == '1') {
            await writeFile(`./contracts/${address}.abi`, response.data.result)
            return JSON.parse(response.data.result);
        }
    }
    return false;
}


const WEB3_RPC = "https://rpc-mainnet.maticvigil.com/v1/APIKEY";


class Contract extends EventEmitter {
    constructor(contractAddress, rpcUrl = WEB3_RPC) {
        super();
        this._web3 = new Web3(rpcUrl)
        this._contractAddress = contractAddress;
        this._contractAbi = undefined;
        this._contract = undefined;
        this.loadAbi();
    }
    async loadAbi() {
        if (this._contractAbi) return true;
        this._contractAbi = await ContractABI(this._contractAddress)

        this.emit("abi", this._contractAbi);
        this.init();
    }
    async init() {
        this._contract = new this._web3.eth.Contract(this._contractAbi, this._contractAddress)
        this.emit("ready", this);
    }
    get methods() {
        return this._contract.methods;
    }
}
module.exports = Contract