import { expect } from "chai";
import { ethers } from "hardhat";
import { GroupSavingsEscrow } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("GroupSavingsEscrow", function () {
  let groupSavingsEscrow: GroupSavingsEscrow;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const GroupSavingsEscrow = await ethers.getContractFactory("GroupSavingsEscrow");
    groupSavingsEscrow = await GroupSavingsEscrow.deploy();
  });

  describe("Group Creation", function () {
    it("Should create a new group", async function () {
      const name = "Test Group";
      const targetAmount = ethers.parseEther("1.0");
      const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now

      await expect(groupSavingsEscrow.createGroup(name, targetAmount, deadline))
        .to.emit(groupSavingsEscrow, "GroupCreated")
        .withArgs(0, owner.address, name, targetAmount, deadline);

      const groupInfo = await groupSavingsEscrow.getGroupInfo(0);
      expect(groupInfo.creator).to.equal(owner.address);
      expect(groupInfo.name).to.equal(name);
      expect(groupInfo.targetAmount).to.equal(targetAmount);
      expect(groupInfo.isActive).to.be.true;
    });
  });

  describe("Contributions", function () {
    it("Should allow users to contribute to a group", async function () {
      const targetAmount = ethers.parseEther("1.0");
      const contribution = ethers.parseEther("0.5");
      const deadline = Math.floor(Date.now() / 1000) + 3600;

      await groupSavingsEscrow.createGroup("Test Group", targetAmount, deadline);

      await expect(
        groupSavingsEscrow.connect(user1).contribute(0, { value: contribution })
      )
        .to.emit(groupSavingsEscrow, "ContributionMade")
        .withArgs(0, user1.address, contribution);

      const userContribution = await groupSavingsEscrow.getUserContribution(0, user1.address);
      expect(userContribution).to.equal(contribution);
    });
  });

  describe("Withdrawals", function () {
    it("Should allow users to withdraw their contributions after group completion", async function () {
      const targetAmount = ethers.parseEther("1.0");
      const contribution = ethers.parseEther("0.5");
      const deadline = Math.floor(Date.now() / 1000) + 3600;

      await groupSavingsEscrow.createGroup("Test Group", targetAmount, deadline);
      await groupSavingsEscrow.connect(user1).contribute(0, { value: contribution });
      await groupSavingsEscrow.connect(user2).contribute(0, { value: contribution });

      await expect(groupSavingsEscrow.connect(user1).withdraw(0))
        .to.emit(groupSavingsEscrow, "WithdrawalMade")
        .withArgs(0, user1.address, contribution);
    });
  });

  describe("Group Information", function () {
    it("Should return correct group information", async function () {
      const name = "Test Group";
      const targetAmount = ethers.parseEther("1.0");
      const deadline = Math.floor(Date.now() / 1000) + 3600;

      await groupSavingsEscrow.createGroup(name, targetAmount, deadline);
      await groupSavingsEscrow.connect(user1).contribute(0, { value: ethers.parseEther("0.5") });

      const groupInfo = await groupSavingsEscrow.getGroupInfo(0);
      expect(groupInfo.members.length).to.equal(2); // creator and contributor
      expect(groupInfo.currentAmount).to.equal(ethers.parseEther("0.5"));
    });
  });
}); 