import { createContext, useContext, useState } from "react";
import { Distribution, Group, GroupMember } from "@/types";
import { mockGroups } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./AuthContext";
import { supabase } from "@/integrations/supabase/client";

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
  addMemberByEmail: (groupId: string, email: string) => Promise<void>;
}

const GroupContext = createContext<GroupContextType | undefined>(undefined);

export function GroupProvider({ children }: { children: React.ReactNode }) {
  const [groups, setGroups] = useState<Group[]>(mockGroups);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
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
      
      const maxMembers = groupData.maxMembers || 10;
      const numberPool = Array.from({ length: maxMembers }, (_, i) => i + 1);
      
      const newGroup: Group = {
        id: `group-${Date.now()}`,
        name: groupData.name || "New Group",
        description: groupData.description || "",
        creatorId: user.id,
        createdAt: new Date(),
        memberCount: 1,
        maxMembers: maxMembers,
        contributionAmount: groupData.contributionAmount || 0,
        currency: groupData.currency || "USD",
        cycleType: groupData.cycleType || "monthly",
        nextDistributionDate: groupData.nextDistributionDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        numberPool: numberPool,
        status: "active",
        currentCycle: 1,
        members: [
          {
            id: `member-${Date.now()}`,
            userId: user.id,
            name: user.name,
            profilePicture: user.profilePicture,
            selectedNumber: null,
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
      
      if (group.members.some(m => m.userId === user.id)) {
        throw new Error("You are already a member of this group");
      }
      
      if (group.memberCount >= group.maxMembers) {
        throw new Error("This group is already full");
      }
      
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
      
      if (group.creatorId === user.id) {
        throw new Error("As the creator, you cannot leave the group. You can delete it instead.");
      }
      
      const memberIndex = group.members.findIndex(m => m.userId === user.id);
      if (memberIndex === -1) {
        throw new Error("You are not a member of this group");
      }
      
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
      
      if (group.creatorId !== user.id) {
        throw new Error("Only the group creator can update group settings");
      }
      
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
      
      if (group.creatorId !== user.id) {
        throw new Error("Only the group creator can delete the group");
      }
      
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
      
      if (!group.numberPool.includes(number)) {
        throw new Error("Invalid number selection. Number is not in the pool.");
      }
      
      if (group.members.some(m => m.selectedNumber === number && m.userId !== user.id)) {
        throw new Error("This number is already selected by another member.");
      }
      
      const memberIndex = group.members.findIndex(m => m.userId === user.id);
      if (memberIndex === -1) {
        throw new Error("You are not a member of this group");
      }
      
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
      
      if (group.creatorId !== user.id) {
        throw new Error("Only the group creator can manage distributions");
      }
      
      const memberIndex = group.members.findIndex(m => m.id === memberId);
      if (memberIndex === -1) {
        throw new Error("Member not found in this group");
      }
      
      const targetMember = group.members[memberIndex];
      
      if (targetMember.hasReceivedPot) {
        throw new Error("This member has already received the pot in this cycle");
      }
      
      const potAmount = group.contributionAmount * group.memberCount;
      
      const updatedMembers = [...group.members];
      updatedMembers[memberIndex] = {
        ...targetMember,
        hasReceivedPot: true
      };
      
      const allReceived = updatedMembers.every(m => m.hasReceivedPot);
      
      const finalMembers = allReceived 
        ? updatedMembers.map(m => ({ ...m, hasReceivedPot: false }))
        : updatedMembers;
      
      const updatedGroup: Group = {
        ...group,
        members: finalMembers,
        currentCycle: allReceived ? group.currentCycle + 1 : group.currentCycle,
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
  
  const addMemberByEmail = async (groupId: string, email: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
      
      if (!user) {
        throw new Error("You must be logged in to add members");
      }
      
      const groupIndex = groups.findIndex(g => g.id === groupId);
      if (groupIndex === -1) {
        throw new Error("Group not found");
      }
      
      const group = groups[groupIndex];
      
      if (group.creatorId !== user.id) {
        throw new Error("Only the group creator can add members");
      }
      
      if (group.memberCount >= group.maxMembers) {
        throw new Error("This group is already full");
      }
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, email')
        .eq('email', email)
        .single();
      
      if (profileError || !profileData) {
        throw new Error("User with this email not found");
      }
      
      const userId = profileData.id;
      
      if (group.members.some(m => m.userId === userId)) {
        throw new Error("This user is already a member of the group");
      }
      
      const newMember: GroupMember = {
        id: `member-${Date.now()}`,
        userId: userId,
        name: profileData.full_name || email.split('@')[0],
        profilePicture: profileData.avatar_url,
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
        title: "Member added successfully",
        description: `${newMember.name} has been added to the group.`,
        variant: "default"
      });
      
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      toast({
        title: "Failed to add member",
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
        getGroupById,
        addMemberByEmail
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
