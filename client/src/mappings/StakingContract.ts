import { BigInt, Address, EthereumBlock } from '@graphprotocol/graph-ts';
import { RewardToken } from '../generated/RewardToken/RewardToken';
import { StakeToken } from '../generated/StakeToken/StakeToken';
import { Staking } from '../generated/Staking/Staking';

// Define the contract addresses
// Here I've used dummy addresses, which you can replace with your main/testnet deployment address
let rewardTokenContract = RewardToken.bind(Address.fromString('0xYourRewardTokenAddress'));
let stakeTokenContract = StakeToken.bind(Address.fromString('0xYourStakeTokenAddress'));
let stakingContract = Staking.bind(Address.fromString('0xYourStakingContractAddress'));

// Define the StakingContract entity
export class StakingContractEntity {
  id: string;
  totalStaked: BigInt;
  totalRewards: BigInt;
}

// Define the Staker entity
export class StakerEntity {
  id: string;
  stakedBalance: BigInt;
  rewards: BigInt;
  userRewardPerTokenPaid: BigInt;
}

// Define the handleBlock function
export function handleBlock(block: EthereumBlock): void {
  // Handle block-level data if needed
}

// Define the handleStake function
export function handleStake(event: Staking.Staked): void {
  let userAddress = event.params.user.toHexString();
  let amountStaked = event.params.amount;

  // Create or update the StakerEntity
  let stakerEntity = StakerEntity.load(userAddress);
  if (!stakerEntity) {
    stakerEntity = new StakerEntity(userAddress);
    stakerEntity.stakedBalance = BigInt.fromI32(0);
    stakerEntity.rewards = BigInt.fromI32(0);
    stakerEntity.userRewardPerTokenPaid = BigInt.fromI32(0);
  }

  // Update staked balance
  stakerEntity.stakedBalance = stakerEntity.stakedBalance.plus(amountStaked);
  stakerEntity.save();

  // Update the total staked amount in the StakingContractEntity
  let stakingContractEntity = StakingContractEntity.load('1'); // Use a unique ID for the staking contract
  if (!stakingContractEntity) {
    stakingContractEntity = new StakingContractEntity('1');
    stakingContractEntity.totalStaked = amountStaked;
    stakingContractEntity.totalRewards = BigInt.fromI32(0);
  } else {
    stakingContractEntity.totalStaked = stakingContractEntity.totalStaked.plus(amountStaked);
  }
  stakingContractEntity.save();
}

// Define the handleUnstake function
export function handleUnstake(event: Staking.Withdrawn): void {
  let userAddress = event.params.user.toHexString();
  let amountUnstaked = event.params.amount;

  // Update the staked balance
  let stakerEntity = StakerEntity.load(userAddress);
  if (stakerEntity) {
    stakerEntity.stakedBalance = stakerEntity.stakedBalance.minus(amountUnstaked);
    stakerEntity.save();
  }

  // Update the total staked amount in the StakingContractEntity
  let stakingContractEntity = StakingContractEntity.load('1');
  if (stakingContractEntity) {
    stakingContractEntity.totalStaked = stakingContractEntity.totalStaked.minus(amountUnstaked);
    stakingContractEntity.save();
  }
}

// Define the handleReward function
export function handleReward(event: Staking.RewardsClaimed): void {
  let userAddress = event.params.user.toHexString();
  let rewardAmount = event.params.amount;

  // Update the rewards
  let stakerEntity = StakerEntity.load(userAddress);
  if (stakerEntity) {
    stakerEntity.rewards = stakerEntity.rewards.plus(rewardAmount);
    stakerEntity.save();
  }
}