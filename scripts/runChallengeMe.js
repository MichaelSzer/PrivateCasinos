const main = async () => {
    const [owner, randomPerson] = await hre.ethers.getSigners();
    const challengeMeContractFactory = await hre.ethers.getContractFactory("ChallengeMe");
    const challengeMeContract = await challengeMeContractFactory.deploy();
    await challengeMeContract.deployed();

    console.log("Contract deployed to:", challengeMeContract.address);
    console.log("Contracted deployed by:", owner.address);

    const [deployer, user1, user2, user3, user4, host] = await hre.ethers.getSigners();

    await challengeMeContract.connect(host).createRouletteGame("Ninja Game", hre.ethers.utils.parseUnits("0.001", "ether"));

    await challengeMeContract.connect(user1).betRoulette("Ninja Game", { value: hre.ethers.utils.parseEther("0.05") });
    await challengeMeContract.connect(user1).betRoulette("Ninja Game", { value: hre.ethers.utils.parseEther("0.15") });

    await challengeMeContract.connect(user2).betRoulette("Ninja Game", { value: hre.ethers.utils.parseEther("0.5") });

    await challengeMeContract.connect(user3).betRoulette("Ninja Game", { value: hre.ethers.utils.parseEther("0.2") });
    
    await challengeMeContract.connect(user4).betRoulette("Ninja Game", { value: hre.ethers.utils.parseEther("0.3") });

    console.log('\n\nBefore Game Finished');
    console.log('user1 balance: ', hre.ethers.utils.formatEther( await user1.getBalance() ));
    console.log('user2 balance: ', hre.ethers.utils.formatEther( await user2.getBalance() ));
    console.log('user3 balance: ', hre.ethers.utils.formatEther( await user3.getBalance() ));
    console.log('user4 balance: ', hre.ethers.utils.formatEther( await user4.getBalance() ));
    console.log('host balance: ', hre.ethers.utils.formatEther( await host.getBalance() ));
    console.log('contract balance: ', hre.ethers.utils.formatEther( await hre.waffle.provider.getBalance(challengeMeContract.address) ));

    await challengeMeContract.connect(host).finishGame();

    console.log('\n\nAfter Game Finished');
    console.log('user1 balance: ', hre.ethers.utils.formatEther( await user1.getBalance() ));
    console.log('user2 balance: ', hre.ethers.utils.formatEther( await user2.getBalance() ));
    console.log('user3 balance: ', hre.ethers.utils.formatEther( await user3.getBalance() ));
    console.log('user4 balance: ', hre.ethers.utils.formatEther( await user4.getBalance() ));
    console.log('host balance: ', hre.ethers.utils.formatEther( await host.getBalance() ));
    console.log('contract balance: ', hre.ethers.utils.formatEther( await hre.waffle.provider.getBalance(challengeMeContract.address) ));
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