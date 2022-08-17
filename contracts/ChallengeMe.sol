// SPDX-License-Identifier: UNLICENSED
pragma solidity <0.9.0;

import "hardhat/console.sol";

/*
    Personal Notes:
        - Good Practice for Smart Contract Layout:
            1. Constructor
            2. Receive Function
            3. Fallback Function
            4. All External Functions
            5. All Public Functions
            6. All Internal Functions
            7. All Private Functions 
*/
contract ChallengeMe {

    address payable owner;

    // Roulette settings
    uint8 public houseFee = 2;
    uint8 public hostFee = 8;
    uint8 public reward = 90;

    struct RouletteBet {
        address player;
        uint amount;
        uint time;
        uint16 id;
    }

    struct RouletteGame {
        bool valid;
        address payable host;
        uint minRouletteBet;
        uint total;
        mapping(address => uint) bets;
        address[] betsOrigin;
        RouletteBet[] rouletteBetsHistory;
    }
    mapping(string => RouletteGame) public rouletteGames;

    mapping(address => string) public host;

    modifier minAmount(string calldata game){
        require(msg.value >= rouletteGames[game].minRouletteBet, "Bet is below the minimum.");
        _;
    }

    modifier onGoingGame {
        require( !rouletteGames[host[msg.sender]].valid, "Finish your previous game before starting a new one.");
        _;
    }

    modifier gameExists(string calldata game){
        require( !rouletteGames[game].valid, "Game already exist.");
        _;
    }

    modifier validGame(string calldata game){
        require( rouletteGames[game].valid, "Game isn't valid.");
        _;
    }

    event RouletteBetSubmission(string indexed game, address indexed player, uint amount, uint time, uint16 id);
    event RouletteWinner(string indexed game, address indexed player, uint amount);

    constructor() {
        owner = payable(msg.sender);
    }

    // when calldata is empty receive() is called. Usually via .send() or .transfer()
    // 2300 gas limit. Can only perform some operations. 
    receive() external payable {
        
    }

    fallback() external {

    }

    /*
        External Functions
    */
    function createRouletteGame(string calldata name, uint minBet) external onGoingGame gameExists(name) {
        host[msg.sender] = name;

        RouletteGame storage rouletteGame = rouletteGames[name];
        
        // Start game
        rouletteGame.valid = true;
        rouletteGame.minRouletteBet = minBet;
        rouletteGame.host = payable(msg.sender);

        console.log("Roulette Game %s created.", name);
    }

    function betRoulette(string calldata name, uint time) external payable validGame(name) minAmount(name) {
        // Is this the first bet ?
        if (rouletteGames[name].bets[msg.sender] == 0)
            rouletteGames[name].betsOrigin.push(msg.sender);

        rouletteGames[name].bets[msg.sender] += msg.value;
        rouletteGames[name].total += msg.value;

        RouletteBet memory rouletteBet = RouletteBet(msg.sender, msg.value, time, uint16(rouletteGames[name].rouletteBetsHistory.length));
        rouletteGames[name].rouletteBetsHistory.push(rouletteBet);

        emit RouletteBetSubmission(name, rouletteBet.player, rouletteBet.amount, rouletteBet.time, rouletteBet.id);

        console.log("A bet in the game %s has been submitted by %s with %d mETH (0.001)", name, msg.sender, msg.value / 1e15 );
    }

    function finishGame() external returns (address) {
        RouletteGame storage rouletteGame = rouletteGames[host[msg.sender]];
        
        require( rouletteGame.valid, "You don't have any roulette game going.");

        rouletteGame.valid = false;

        address payable winner = generateRandomWinner(rouletteGame);

        // Set all bets to zero
        for(uint i = rouletteGame.betsOrigin.length; i > 0; i--){
            rouletteGame.bets[rouletteGame.betsOrigin[i-1]] = 0;
            rouletteGame.betsOrigin.pop();
        }
        
        // Distribute money
        winner.transfer((rouletteGame.total / 100)*reward);
        rouletteGame.host.transfer((rouletteGame.total / 100)*hostFee);
        owner.transfer((rouletteGame.total / 100)*houseFee);

        rouletteGame.total = 0;

        return winner;
    }

    function getRoulettePlayers(string calldata name) external view returns(address[] memory players) 
    {
        players = rouletteGames[name].betsOrigin;
    }

    function getRouletteBet(string calldata name, address player) external view returns(uint bet) 
    {
        bet = rouletteGames[name].bets[player];
    }

    function getRouletteHistory(string calldata name) external view returns(RouletteBet[] memory rouletteBetsHistory)
    {
        rouletteBetsHistory = rouletteGames[name].rouletteBetsHistory;
    }

    /*
        Public Functions
    */

    /*
        Internal Functions
    */

    /*
        Private Functions
    */
    function generateRandomWinner(RouletteGame storage rouletteGame) private view returns (address payable) {

        // This is hackable. Anyone can get the timestamp and predict the winner
        return payable(rouletteGame.betsOrigin[block.timestamp % rouletteGame.betsOrigin.length]);
    } 
}