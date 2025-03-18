
import { Group } from "@/types";
import { toast } from "@/hooks/use-toast";

export const updateGroupOperation = (
  user: any,
  groups: Group[],
  setGroups: React.Dispatch<React.SetStateAction<Group[]>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  return async (groupId: string, groupData: Partial<Group>): Promise<Group> => {
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
};
