
import { Group } from "@/types";
import { toast } from "@/hooks/use-toast";

export const joinGroupOperation = (
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
      
      const newMember = {
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
};
