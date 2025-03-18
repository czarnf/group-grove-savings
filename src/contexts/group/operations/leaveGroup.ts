
import { Group } from "@/types";
import { toast } from "@/hooks/use-toast";

export const leaveGroupOperation = (
  user: any,
  groups: Group[],
  setGroups: React.Dispatch<React.SetStateAction<Group[]>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  return async (groupId: string): Promise<void> => {
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
};
