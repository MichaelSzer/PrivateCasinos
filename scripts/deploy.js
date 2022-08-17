const main = async () => {
    // hre.ethers is from the plugin https://hardhat.org/hardhat-runner/plugins/nomiclabs-hardhat-ethers
    /*
        A provider provides an abstraction to a coonection to the Ethereum blockchain.
        Providers can only call read-access functions & properties.
        ---
        A signer is a representation of an Ethereum account. It has access to a Private Key.
        Signers can sign transactions & send them to the blockchain to change it.
        ---
        A contract is an abstraction that represent a connection to an specific contract on the ethereum network.
    */
    const [deployer] = await hre.ethers.getSigners();
    const accountBalance = await deployer.getBalance();

    console.log("Deploying contracts with account:", deployer.address);
    console.log("Account balance:", accountBalance);

    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
    const waveContract = await waveContractFactory.deploy();
    await waveContract.deployed();

    waveTxn = waveContract.connect(deployer).wave("Vacas ???");

    console.log("WavePortal address:", waveContract.address);
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