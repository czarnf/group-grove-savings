
import { Group } from "@/types";
import { toast } from "@/hooks/use-toast";

export const selectNumberOperation = (
  user: any,
  groups: Group[],
  setGroups: React.Dispatch<React.SetStateAction<Group[]>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  return async (groupId: string, number: number): Promise<void> => {
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
};
