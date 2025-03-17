
import { createContext, useContext, useState } from "react";
import { Distribution, Group, GroupMember } from "@/types";
import { mockGroups } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./AuthContext";

interface GroupContextType {
  groups: Group[];
  userGroups: Group[];
  loading: boolean;
  error: string | null;
  createGroup: (groupData: Partial<Group>) => Promise<Group>;
  joinGroup: (groupId: string) => Promise<void>;
  leaveGroup: (groupId: string) => Promise<void>;
  updateGroup: (groupId: string, groupData: Partial<Group>) => Promise<Group>;
  deleteGroup: (groupId: string) => Promise<void>;
  selectNumber: (groupId: string, number: number) => Promise<void>;
  distributeToMember: (groupId: string, memberId: string) => Promise<Distribution>;
  getGroupById: (groupId: string) => Group | undefined;
}

const GroupContext = createContext<GroupContextType | undefined>(undefined);

export function GroupProvider({ children }: { children: React.ReactNode }) {
  const [groups, setGroups] = useState<Group[]>(mockGroups);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Filter groups where the current user is a member
  const userGroups = groups.filter(group => 
    group.members.some(member => member.userId === user?.id)
  );
  
  const createGroup = async (groupData: Partial<Group>): Promise<Group> => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
      
      if (!user) {
        throw new Error("You must be logged in to create a group");
      }
      
      // Generate number pool based on max members
      const maxMembers = groupData.maxMembers || 10;
      const numberPool = Array.from({ length: maxMembers }, (_, i) => i + 1);
      
      const newGroup: Group = {
        id: `group-${Date.now()}`,
        name: groupData.name || "New Group",
        description: groupData.description || "",
        creatorId: user.id,
        createdAt: new Date(),
        memberCount: 1, // Creator is the first member
        maxMembers: maxMembers,
        contributionAmount: groupData.contributionAmount || 0,
        currency: groupData.currency || "USD",
        cycleType: groupData.cycleType || "monthly",
        nextDistributionDate: groupData.nextDistributionDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        numberPool: numberPool,
        status: "active",
        currentCycle: 1,
        members: [
          {
            id: `member-${Date.now()}`,
            userId: user.id,
            name: user.name,
            profilePicture: user.profilePicture,
            selectedNumber: null, // Creator starts with no number selected
            hasReceivedPot: false,
            joinedAt: new Date()
          }
        ]
      };
      
      setGroups(prevGroups => [...prevGroups, newGroup]);
      
      toast({
        title: "Group created successfully",
        description: `Your group "${newGroup.name}" has been created.`,
        variant: "default"
      });
      
      return newGroup;
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      toast({
        title: "Failed to create group",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const joinGroup = async (groupId: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
      
      if (!user) {
        throw new Error("You must be logged in to join a group");
      }
      
      const groupIndex = groups.findIndex(g => g.id === groupId);
      if (groupIndex === -1) {
        throw new Error("Group not found");
      }
      
      const group = groups[groupIndex];
      
      // Check if user is already a member
      if (group.members.some(m => m.userId === user.id)) {
        throw new Error("You are already a member of this group");
      }
      
      // Check if group is full
      if (group.memberCount >= group.maxMembers) {
        throw new Error("This group is already full");
      }
      
      // Add user as a new member
      const newMember: GroupMember = {
        id: `member-${Date.now()}`,
        userId: user.id,
        name: user.name,
        profilePicture: user.profilePicture,
        selectedNumber: null,
        hasReceivedPot: false,
        joinedAt: new Date()
      };
      
      const updatedGroup = {
        ...group,
        memberCount: group.memberCount + 1,
        members: [...group.members, newMember]
      };
      
      const updatedGroups = [...groups];
      updatedGroups[groupIndex] = updatedGroup;
      setGroups(updatedGroups);
      
      toast({
        title: "Joined group successfully",
        description: `You are now a member of "${group.name}".`,
        variant: "default"
      });
      
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      toast({
        title: "Failed to join group",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const leaveGroup = async (groupId: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
      
      if (!user) {
        throw new Error("You must be logged in to leave a group");
      }
      
      const groupIndex = groups.findIndex(g => g.id === groupId);
      if (groupIndex === -1) {
        throw new Error("Group not found");
      }
      
      const group = groups[groupIndex];
      
      // Check if user is the creator
      if (group.creatorId === user.id) {
        throw new Error("As the creator, you cannot leave the group. You can delete it instead.");
      }
      
      // Check if user is a member
      const memberIndex = group.members.findIndex(m => m.userId === user.id);
      if (memberIndex === -1) {
        throw new Error("You are not a member of this group");
      }
      
      // Remove user from members
      const updatedMembers = group.members.filter(m => m.userId !== user.id);
      
      const updatedGroup = {
        ...group,
        memberCount: group.memberCount - 1,
        members: updatedMembers
      };
      
      const updatedGroups = [...groups];
      updatedGroups[groupIndex] = updatedGroup;
      setGroups(updatedGroups);
      
      toast({
        title: "Left group successfully",
        description: `You have left "${group.name}".`,
        variant: "default"
      });
      
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      toast({
        title: "Failed to leave group",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const updateGroup = async (groupId: string, groupData: Partial<Group>): Promise<Group> => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
      
      if (!user) {
        throw new Error("You must be logged in to update a group");
      }
      
      const groupIndex = groups.findIndex(g => g.id === groupId);
      if (groupIndex === -1) {
        throw new Error("Group not found");
      }
      
      const group = groups[groupIndex];
      
      // Check if user is the creator
      if (group.creatorId !== user.id) {
        throw new Error("Only the group creator can update group settings");
      }
      
      // Update group data
      const updatedGroup = {
        ...group,
        ...groupData,
      };
      
      const updatedGroups = [...groups];
      updatedGroups[groupIndex] = updatedGroup;
      setGroups(updatedGroups);
      
      toast({
        title: "Group updated successfully",
        description: `The group "${updatedGroup.name}" has been updated.`,
        variant: "default"
      });
      
      return updatedGroup;
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      toast({
        title: "Failed to update group",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const deleteGroup = async (groupId: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
      
      if (!user) {
        throw new Error("You must be logged in to delete a group");
      }
      
      const group = groups.find(g => g.id === groupId);
      if (!group) {
        throw new Error("Group not found");
      }
      
      // Check if user is the creator
      if (group.creatorId !== user.id) {
        throw new Error("Only the group creator can delete the group");
      }
      
      // Delete the group
      const updatedGroups = groups.filter(g => g.id !== groupId);
      setGroups(updatedGroups);
      
      toast({
        title: "Group deleted successfully",
        description: `The group "${group.name}" has been deleted.`,
        variant: "default"
      });
      
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      toast({
        title: "Failed to delete group",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const selectNumber = async (groupId: string, number: number) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
      
      if (!user) {
        throw new Error("You must be logged in to select a number");
      }
      
      const groupIndex = groups.findIndex(g => g.id === groupId);
      if (groupIndex === -1) {
        throw new Error("Group not found");
      }
      
      const group = groups[groupIndex];
      
      // Check if number is in the pool
      if (!group.numberPool.includes(number)) {
        throw new Error("Invalid number selection. Number is not in the pool.");
      }
      
      // Check if number is already selected by another member
      if (group.members.some(m => m.selectedNumber === number && m.userId !== user.id)) {
        throw new Error("This number is already selected by another member.");
      }
      
      // Find user's member record
      const memberIndex = group.members.findIndex(m => m.userId === user.id);
      if (memberIndex === -1) {
        throw new Error("You are not a member of this group");
      }
      
      // Update user's selected number
      const updatedMembers = [...group.members];
      updatedMembers[memberIndex] = {
        ...updatedMembers[memberIndex],
        selectedNumber: number
      };
      
      const updatedGroup = {
        ...group,
        members: updatedMembers
      };
      
      const updatedGroups = [...groups];
      updatedGroups[groupIndex] = updatedGroup;
      setGroups(updatedGroups);
      
      toast({
        title: "Number selected successfully",
        description: `You've selected number ${number} for "${group.name}".`,
        variant: "default"
      });
      
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      toast({
        title: "Failed to select number",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const distributeToMember = async (groupId: string, memberId: string): Promise<Distribution> => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
      
      if (!user) {
        throw new Error("You must be logged in to distribute funds");
      }
      
      const groupIndex = groups.findIndex(g => g.id === groupId);
      if (groupIndex === -1) {
        throw new Error("Group not found");
      }
      
      const group = groups[groupIndex];
      
      // Check if user is the creator
      if (group.creatorId !== user.id) {
        throw new Error("Only the group creator can manage distributions");
      }
      
      // Find target member
      const memberIndex = group.members.findIndex(m => m.id === memberId);
      if (memberIndex === -1) {
        throw new Error("Member not found in this group");
      }
      
      const targetMember = group.members[memberIndex];
      
      // Check if member has already received the pot
      if (targetMember.hasReceivedPot) {
        throw new Error("This member has already received the pot in this cycle");
      }
      
      // Calculate pot amount
      const potAmount = group.contributionAmount * group.memberCount;
      
      // Mark member as received
      const updatedMembers = [...group.members];
      updatedMembers[memberIndex] = {
        ...targetMember,
        hasReceivedPot: true
      };
      
      // Check if all members have received the pot
      const allReceived = updatedMembers.every(m => m.hasReceivedPot);
      
      // Update group
      const updatedGroup: Group = {
        ...group,
        members: updatedMembers,
        // If all received, start a new cycle
        currentCycle: allReceived ? group.currentCycle + 1 : group.currentCycle,
        // If all received, reset hasReceivedPot for all members
        members: allReceived
          ? updatedMembers.map(m => ({ ...m, hasReceivedPot: false }))
          : updatedMembers,
        // Set next distribution date
        nextDistributionDate: new Date(
          group.cycleType === 'monthly'
            ? new Date().setMonth(new Date().getMonth() + 1)
            : group.cycleType === 'bi-weekly'
            ? new Date().setDate(new Date().getDate() + 14)
            : new Date().setDate(new Date().getDate() + 7)
        )
      };
      
      const updatedGroups = [...groups];
      updatedGroups[groupIndex] = updatedGroup;
      setGroups(updatedGroups);
      
      // Create distribution record
      const distribution: Distribution = {
        id: `dist-${Date.now()}`,
        groupId: groupId,
        recipientId: memberId,
        amount: potAmount,
        distributionDate: new Date(),
        cycle: group.currentCycle,
        status: 'completed'
      };
      
      toast({
        title: "Distribution completed",
        description: `${targetMember.name} has received the pot of ${potAmount} ${group.currency}.`,
        variant: "default"
      });
      
      if (allReceived) {
        toast({
          title: "Cycle completed",
          description: `All members have received the pot. Starting cycle ${updatedGroup.currentCycle}.`,
          variant: "default"
        });
      }
      
      return distribution;
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      toast({
        title: "Distribution failed",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const getGroupById = (groupId: string) => {
    return groups.find(g => g.id === groupId);
  };
  
  return (
    <GroupContext.Provider
      value={{
        groups,
        userGroups,
        loading,
        error,
        createGroup,
        joinGroup,
        leaveGroup,
        updateGroup,
        deleteGroup,
        selectNumber,
        distributeToMember,
        getGroupById
      }}
    >
      {children}
    </GroupContext.Provider>
  );
}

export function useGroups() {
  const context = useContext(GroupContext);
  if (context === undefined) {
    throw new Error("useGroups must be used within a GroupProvider");
  }
  return context;
}
