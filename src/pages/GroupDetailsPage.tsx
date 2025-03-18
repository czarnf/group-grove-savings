
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGroups } from "@/contexts/GroupContext";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, CreditCard, Info } from "lucide-react";

// Import our new components
import { GroupHeader } from "@/components/groups/details/GroupHeader";
import { GroupStatCards } from "@/components/groups/details/GroupStatCards";
import { MembersTabContent } from "@/components/groups/details/MembersTabContent";
import { NumberTabContent } from "@/components/groups/details/NumberTabContent";
import { InfoTabContent } from "@/components/groups/details/InfoTabContent";

export default function GroupDetailsPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { getGroupById, distributeToMember, leaveGroup, deleteGroup } = useGroups();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const group = getGroupById(groupId || "");
  
  // Redirect to groups page if group not found
  useEffect(() => {
    if (!group && !isLoading) {
      navigate("/groups");
    }
  }, [group, navigate, isLoading]);
  
  if (!group) {
    return (
      <div className="container py-10 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading group...</p>
      </div>
    );
  }
  
  const isCreator = group.creatorId === user?.id;
  const currentUserMember = group.members.find(m => m.userId === user?.id);
  const totalPot = group.contributionAmount * group.memberCount;
  
  const handleDistribute = async (memberId: string) => {
    setIsLoading(true);
    try {
      await distributeToMember(group.id, memberId);
    } catch (error) {
      console.error("Error distributing funds:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLeaveGroup = async () => {
    setIsLoading(true);
    try {
      await leaveGroup(group.id);
      navigate("/groups");
    } catch (error) {
      console.error("Error leaving group:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteGroup = async () => {
    setIsLoading(true);
    try {
      await deleteGroup(group.id);
      navigate("/groups");
    } catch (error) {
      console.error("Error deleting group:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container py-10">
      <GroupHeader 
        group={group} 
        isCreator={isCreator} 
        onDeleteGroup={handleDeleteGroup} 
        onLeaveGroup={handleLeaveGroup} 
      />
      
      <GroupStatCards group={group} />
      
      <Tabs defaultValue="members" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3 mb-8">
          <TabsTrigger value="members" className="flex items-center">
            <Users className="h-4 w-4 mr-2" /> Members
          </TabsTrigger>
          <TabsTrigger value="number" className="flex items-center">
            <CreditCard className="h-4 w-4 mr-2" /> Your Number
          </TabsTrigger>
          <TabsTrigger value="info" className="flex items-center">
            <Info className="h-4 w-4 mr-2" /> Group Info
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="members">
          <MembersTabContent 
            group={group} 
            isCreator={isCreator} 
            onDistribute={handleDistribute} 
            isLoading={isLoading} 
          />
        </TabsContent>
        
        <TabsContent value="number">
          <NumberTabContent group={group} />
        </TabsContent>
        
        <TabsContent value="info">
          <InfoTabContent group={group} totalPot={totalPot} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
