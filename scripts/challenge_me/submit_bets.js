require("dotenv").config();

const main = async () => {

    const [deployer, user1, user2] = await hre.ethers.getSigners();
    const challengeMeContractFactory = await hre.ethers.getContractFactory("ChallengeMe");
    const challengeMeContract = challengeMeContractFactory.attach(process.env.CHALLENGE_ME_CONTRACT_ADDR);

    /*
        Random bets from users
    */
    ethValue = hre.ethers.utils.parseUnits('0.001') // Big Number 0.001 ETH in WEI
    time = (new Date()).getTime()  - 40000 // 40 seconds ago
    txnResponse = await challengeMeContract.connect(user2).betRoulette('Ninja', time, { value: ethValue })
    txn = await txnResponse.wait();
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