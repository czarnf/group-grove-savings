
import { Distribution, Group } from "@/types";
import { toast } from "@/hooks/use-toast";

export const distributeToMemberOperation = (
  user: any,
  groups: Group[],
  setGroups: React.Dispatch<React.SetStateAction<Group[]>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  return async (groupId: string, memberId: string): Promise<Distribution> => {
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
};
