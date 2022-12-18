import Web3 from "web3";
import VotingContract from './Voting.json';

// NOTE: 
// if http://localhost:8545 not working then try this http://127.0.0.1:8545/ 
async function connectWeb3() {
    const provider = new Web3.providers.HttpProvider( "http://localhost:8545");
    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = await VotingContract.networks[networkId];
    const instance = new web3.eth.Contract(
        VotingContract.abi,
        deployedNetwork.address
    );
    return {accounts, instance}
}

//function for using Metamask
async function connectWeb3Metamask() {
    const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:8545");
    await window.ethereum.enable();
    const accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();
    console.log("Injected web3 detected.", accounts, networkId);
    const deployedNetwork = await VotingContract.networks[networkId];
    const instance = new web3.eth.Contract(
        VotingContract.abi,
        deployedNetwork.address
    );
    return {accounts, instance}
}

async function registerCandidates(contractInstance, account, _name, _age, _candidateAddress){
    try {
        let res2 = await contractInstance.methods.registerCandidates(
            _name,
            Number(_age),
            _candidateAddress
        ).send({from: account, gas: 3000000});
    
        console.log("Res:",res2);
        return {error: false, message: res2.events.success.returnValues.msg}
    } catch (error) {
        console.log("Error:",error);
        return {error: true, message: error.message}
    }
    
}

async function whiteListAddress(contractInstance, account, _voterAddress){
    try {
        let res2 = await contractInstance.methods.whiteListAddress(_voterAddress).send({from: account});
        console.log("Res:",res2);
        return {error: false, message: res2.events.success.returnValues.msg}
    } catch (error) {
        console.log("Error:",error);
        return {error: true, message: error.message}
    }
        
}

async function startVoting(contractInstance, account){
    try {
        let res2 = await contractInstance.methods.startVoting().send({from: account});
        console.log("Res:",res2);
        return {error: false, message: res2.events.success.returnValues.msg}
    } catch (error) {
        console.log("Error:",error);
        return {error: true, message: error.message}
    }
    
}

async function stopVoting(contractInstance, account){
    try {
        let res2 = await contractInstance.methods.stopVoting().send({from: account});
        console.log("Res:",res2);
        return {error: false, message: res2.events.success.returnValues.msg}
    } catch (error) {
        console.log("Error:",error);
        return {error: true, message: error.message}
    }
    
}

async function votingStarted(contractInstance, account){
    try {
        let res2 = await contractInstance.methods.votingStatus().call({from: account});
        console.log("Res:",res2);
        return {error: false, message: res2}
    } catch (error) {
        console.log("Error:",error);
        return {error: true, message: error.message}
    }
    
}

async function getWinner(contractInstance, account){
    try {
        let res2 = await contractInstance.methods.getWinner().call({from: account});
        console.log("res:", res2);
        return {error: false, message: {candidateAddress: res2.candidateAddress, age: res2.age, name: res2.name}}
    } catch (error) {
        console.log("Error:",error);
        return {error: true, message: error.message}
    }
    
}

async function getAllCandidate(contractInstance, account){
    try {
        let candidateList = []
        let res2 = await contractInstance.methods.getAllCandidate().call({from: account});

        for(let i=1;i<res2.length;i++){
            candidateList.push(res2[i])
        }

        console.log("list:", candidateList);
        return {error: false, message: candidateList}
    } catch (error) {
        console.log("Error:",error);
        return {error: true, message: error.message}
    }
    
}

async function putVote(contractInstance, account, _candidateAddress){
    try {
        let res2 = await contractInstance.methods.putVote(_candidateAddress).send({from: account, gas: 3000000});
        console.log("res:",res2);
        return {error: false, message: res2.events.success.returnValues.msg}
    } catch (error) {
        console.log("Error:",error);
        return {error: true, message: error.message}
    }
    
}

export {
    connectWeb3, 
    connectWeb3Metamask,
    putVote,
    getAllCandidate,
    getWinner,
    registerCandidates,
    whiteListAddress,
    startVoting,
    stopVoting,
    votingStarted
}