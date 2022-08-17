require("dotenv").config();

const main = async () => {

    contractAddress = process.env.WAVE_CONTRACT_ADDR;

    const [owner] = await hre.ethers.getSigners();
    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
    const waveContract = waveContractFactory.attach(contractAddress);

    let waveCount;
    waveCount = await waveContract.getTotalWaves();
    console.log('Total waves: ', waveCount);

    let waveTxn = await waveContract.wave('Hello Miguel');
    await waveTxn.wait();

    waveTxn = await waveContract.wave('Vacas quanticas');
    await waveTxn.wait();

    waveCount = await waveContract.getTotalWaves();
    console.log('Total waves: ', waveCount);

    const allWaves = await waveContract.getAllWaves();
    console.log(allWaves);
  };
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0); // exit Node process without error
    } catch (error) {
      console.log(error);
      process.exit(1); // exit Node process while indicating 'Uncaught Fatal Exception' error
    }
    // Read more about Node exit ('process.exit(num)') status codes here: https://stackoverflow.com/a/47163396/7974948
  };
  
  runMain();