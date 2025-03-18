
import { Group } from "@/types";
import { toast } from "@/hooks/use-toast";

export const createGroupOperation = (
  user: any,
  setGroups: React.Dispatch<React.SetStateAction<Group[]>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  return async (groupData: Partial<Group>): Promise<Group> => {
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
};
