// eslint-disable-next-line no-undef
const CrowdfundingCamp = artifacts.require('CrowdfundingCamp');

module.exports = function(deployer) {
  // Use deployer to state migration tasks.
  deployer.deploy(CrowdfundingCamp)
  .then(() => CrowdfundingCamp.deployed())
  .then(instance => {
    console.log("Contract CrowdfundingCamp deployed at:", instance.address);
  })
  .catch(error => {
    console.error("Error deploying contract:", error);
  });
};
