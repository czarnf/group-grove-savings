
import { Group } from "@/types";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const addMemberByEmailOperation = (
  user: any,
  groups: Group[],
  setGroups: React.Dispatch<React.SetStateAction<Group[]>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  return async (groupId: string, email: string): Promise<void> => {
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
      
      const newMember = {
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
};
