const { timeAgoFormatter } = require('./helpers/timeAgoFormatter')

const main = async () => {
    const [deployer, user1, user2, user3, user4] = await hre.ethers.getSigners();
    const accountBalance = await deployer.getBalance();

    console.log("Deploying contracts with account:", deployer.address);
    console.log("Account balance:", accountBalance);

    const challengeMeContractFactory = await hre.ethers.getContractFactory("ChallengeMe");
    const challengeMeContract = await challengeMeContractFactory.deploy();
    await challengeMeContract.deployed();

    console.log("ChallengeMe address:", challengeMeContract.address);

    const ethMinBet = hre.ethers.utils.parseUnits('0.001') // Big Number 0.001 ETH in WEI 
    // https://docs.ethers.io/v5/api/providers/types/#types--transactions
    // Transaction Reponse
    txnResponse = await challengeMeContract.connect(user1).createRouletteGame('Ninja', ethMinBet)
    // Transaction Receipt
    txn = await txnResponse.wait();

    /*
        Random bets from users
    */
    ethValue = hre.ethers.utils.parseUnits('0.001') // Big Number 0.001 ETH in WEI
    time = (new Date()).getTime()  - 40000 // 40 seconds ago
    txnResponse = await challengeMeContract.connect(user2).betRoulette('Ninja', time, { value: ethValue })
    txn = await txnResponse.wait();

    ethValue = hre.ethers.utils.parseUnits('0.01') // Big Number 0.01 ETH in WEI 
    time = (new Date()).getTime() - 480000 // 8 minutes ago
    txnResponse = await challengeMeContract.connect(user3).betRoulette('Ninja', time, { value: ethValue })
    txn = await txnResponse.wait();

    ethValue = hre.ethers.utils.parseUnits('0.15') // Big Number 0.15 ETH in WEI 
    time = (new Date()).getTime() - 180000 // 3 minutes ago
    txnResponse = await challengeMeContract.connect(user3).betRoulette('Ninja', time, { value: ethValue })
    txn = await txnResponse.wait();

    /*
        Read bets history to check
    */
    const rouletteHistory = await challengeMeContract.getRouletteHistory('Ninja')
    const times = rouletteHistory.map( ({ time }) => timeAgoFormatter(time) )
    console.log('Times: ', times)
}

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

runMain();