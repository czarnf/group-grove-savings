import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { GroupSavingsEscrow } from '../typechain-types';
import { useToast } from './ui/use-toast';

interface BlockchainIntegrationProps {
  contractAddress: string;
}

export const BlockchainIntegration: React.FC<BlockchainIntegrationProps> = ({ contractAddress }) => {
  const [contract, setContract] = useState<GroupSavingsEscrow | null>(null);
  const [account, setAccount] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    initializeContract();
  }, []);

  const initializeContract = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        setAccount(await signer.getAddress());

        const contract = new ethers.Contract(
          contractAddress,
          [
            'function createGroup(string name, uint256 targetAmount, uint256 deadline) external returns (uint256)',
            'function contribute(uint256 groupId) external payable',
            'function withdraw(uint256 groupId) external',
            'function getGroupInfo(uint256 groupId) external view returns (address, string, uint256, uint256, uint256, bool, address[])',
            'function getUserContribution(uint256 groupId, address user) external view returns (uint256)',
            'function getUserGroups(address user) external view returns (uint256[])'
          ],
          signer
        ) as unknown as GroupSavingsEscrow;

        setContract(contract);
      } else {
        toast({
          title: 'Error',
          description: 'Please install MetaMask to use this feature',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error initializing contract:', error);
      toast({
        title: 'Error',
        description: 'Failed to initialize blockchain connection',
        variant: 'destructive',
      });
    }
  };

  const createGroup = async (name: string, targetAmount: string, deadline: number) => {
    if (!contract) return;

    try {
      setLoading(true);
      const tx = await contract.createGroup(
        name,
        ethers.parseEther(targetAmount),
        deadline
      );
      await tx.wait();
      toast({
        title: 'Success',
        description: 'Group created successfully',
      });
    } catch (error) {
      console.error('Error creating group:', error);
      toast({
        title: 'Error',
        description: 'Failed to create group',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const contribute = async (groupId: number, amount: string) => {
    if (!contract) return;

    try {
      setLoading(true);
      const tx = await contract.contribute(groupId, {
        value: ethers.parseEther(amount),
      });
      await tx.wait();
      toast({
        title: 'Success',
        description: 'Contribution made successfully',
      });
    } catch (error) {
      console.error('Error contributing:', error);
      toast({
        title: 'Error',
        description: 'Failed to make contribution',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const withdraw = async (groupId: number) => {
    if (!contract) return;

    try {
      setLoading(true);
      const tx = await contract.withdraw(groupId);
      await tx.wait();
      toast({
        title: 'Success',
        description: 'Withdrawal successful',
      });
    } catch (error) {
      console.error('Error withdrawing:', error);
      toast({
        title: 'Error',
        description: 'Failed to withdraw funds',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getGroupInfo = async (groupId: number) => {
    if (!contract) return null;

    try {
      const info = await contract.getGroupInfo(groupId);
      return {
        creator: info[0],
        name: info[1],
        targetAmount: ethers.formatEther(info[2]),
        currentAmount: ethers.formatEther(info[3]),
        deadline: new Date(Number(info[4]) * 1000),
        isActive: info[5],
        members: info[6],
      };
    } catch (error) {
      console.error('Error getting group info:', error);
      return null;
    }
  };

  return {
    contract,
    account,
    loading,
    createGroup,
    contribute,
    withdraw,
    getGroupInfo,
  };
}; 