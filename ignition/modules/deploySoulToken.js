const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const pyusdAddress = "0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9";
module.exports = buildModule("SoulTokenDeployment", (m) => {
    // The deployer will automatically be the first signer
    const deployer = m.getAccount(0);

    // Define the contract to deploy with the deployer as the initialOwner
    const soulToken = m.contract("SoulToken", [deployer, pyusdAddress]);


    // Return the deployed contract instance
    return { soulToken };
});