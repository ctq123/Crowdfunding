const CrowdfundingCamp = artifacts.require("CrowdfundingCamp");

module.exports = function(deployer) {
  deployer.deploy(CrowdfundingCamp);
};
