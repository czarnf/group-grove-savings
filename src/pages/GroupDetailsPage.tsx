
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGroups } from "@/contexts/GroupContext";
import { useAuth } from "@/contexts/AuthContext";
import { GroupMemberList } from "@/components/groups/GroupMemberList";
import { NumberSelector } from "@/components/groups/NumberSelector";
import { AddMemberForm } from "@/components/groups/AddMemberForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { ArrowLeft, Calendar, CircleDollarSign, CreditCard, Users, Info, Settings, Trash2, Clock, UserPlus } from "lucide-react";

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
  
  const handleGoBack = () => {
    navigate("/groups");
  };
  
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
      <Button variant="ghost" onClick={handleGoBack} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Groups
      </Button>
      
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">{group.name}</h1>
          <p className="text-muted-foreground">{group.description}</p>
        </div>
        
        {isCreator ? (
          <div className="flex gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete Group
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the group and all its data. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteGroup} className="bg-destructive text-destructive-foreground">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ) : (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">
                Leave Group
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Leave this group?</AlertDialogTitle>
                <AlertDialogDescription>
                  You will no longer be part of this savings group. You can rejoin later if the group is not full.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleLeaveGroup}>
                  Leave
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Current Pot
            </CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {group.currency} {totalPot.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {group.memberCount} members × {group.currency} {group.contributionAmount}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Next Distribution
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {format(new Date(group.nextDistributionDate), "MMM d, yyyy")}
            </div>
            <p className="text-xs text-muted-foreground">
              Cycle: {group.cycleType}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Current Cycle
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Cycle {group.currentCycle}
            </div>
            <p className="text-xs text-muted-foreground">
              {group.members.filter(m => m.hasReceivedPot).length} of {group.memberCount} received
            </p>
          </CardContent>
        </Card>
      </div>
      
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <GroupMemberList members={group.members} />
            </div>
            
            {isCreator && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <UserPlus className="mr-2 h-5 w-5" />
                      Add Member
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AddMemberForm groupId={group.id} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="mr-2 h-5 w-5" />
                      Admin Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        As the group creator, you can manage distributions and group settings.
                      </p>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Distribute Funds</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Select a member to receive the current pot:
                        </p>
                        
                        {group.members
                          .filter(m => !m.hasReceivedPot)
                          .map(member => (
                            <Button
                              key={member.id}
                              variant="outline"
                              className="w-full justify-between mb-2"
                              onClick={() => handleDistribute(member.id)}
                              disabled={isLoading}
                            >
                              {member.name}
                              <span className="text-muted-foreground">
                                #{member.selectedNumber || "?"}
                              </span>
                            </Button>
                          ))}
                          
                        {group.members.filter(m => !m.hasReceivedPot).length === 0 && (
                          <p className="text-sm text-orange-500">
                            All members have received the pot in this cycle.
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="number">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <NumberSelector group={group} />
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Info className="mr-2 h-5 w-5" />
                  How It Works
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm">
                    Each member selects a unique number from the pool. When it's time for distribution, 
                    the selected member receives the entire pot for that cycle.
                  </p>
                  
                  <p className="text-sm">
                    Once a member receives the pot, they are marked as completed for the current cycle 
                    but will still contribute to future pots until everyone has received their share.
                  </p>
                  
                  <p className="text-sm">
                    After all members have received the pot, the cycle resets and begins again.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="info">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Group Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Created</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(group.createdAt), "MMMM d, yyyy")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Status</p>
                      <div className="flex items-center">
                        <div className={`h-2 w-2 rounded-full mr-2 ${
                          group.status === 'active' ? 'bg-green-500' : 
                          group.status === 'paused' ? 'bg-amber-500' : 'bg-blue-500'
                        }`}></div>
                        <p className="text-sm text-muted-foreground capitalize">{group.status}</p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Contribution</p>
                      <p className="text-sm text-muted-foreground">
                        {group.currency} {group.contributionAmount.toLocaleString()} per member
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Cycle Type</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {group.cycleType}
                      </p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <p className="text-sm font-medium">Number Pool</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {group.numberPool.map(number => {
                        const isTaken = group.members.some(m => m.selectedNumber === number);
                        return (
                          <div
                            key={number}
                            className={`inline-flex items-center justify-center h-8 w-8 rounded-full text-xs font-medium ${
                              isTaken ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'
                            }`}
                          >
                            {number}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Cycle Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Members Received</span>
                      <span className="text-sm text-muted-foreground">
                        {group.members.filter(m => m.hasReceivedPot).length} / {group.memberCount}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ 
                          width: `${(group.members.filter(m => m.hasReceivedPot).length / group.memberCount) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Distribution History</h4>
                    
                    {group.members.some(m => m.hasReceivedPot) ? (
                      <div className="space-y-3">
                        {group.members
                          .filter(m => m.hasReceivedPot)
                          .map(member => (
                            <div key={member.id} className="flex justify-between items-center">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                                  {member.name.substring(0, 2).toUpperCase()}
                                </div>
                                <span>{member.name}</span>
                              </div>
                              <span className="text-sm font-medium">
                                {group.currency} {totalPot.toLocaleString()}
                              </span>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No distributions have been made in this cycle yet.
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
