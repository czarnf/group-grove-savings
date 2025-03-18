
import { Group } from "@/types";
import { toast } from "@/hooks/use-toast";

export const deleteGroupOperation = (
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
};
