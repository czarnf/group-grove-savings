
import { useParams, useNavigate } from "react-router-dom";
import { useGroups } from "@/contexts/GroupContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GroupMemberList } from "@/components/groups/GroupMemberList";
import { NumberSelector } from "@/components/groups/NumberSelector";
import { CalendarIcon, CircleDollarSign, Clock, MoreHorizontal, RefreshCw, UserPlus } from "lucide-react";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

export default function GroupDetailsPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const { getGroupById, leaveGroup, deleteGroup } = useGroups();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const group = getGroupById(groupId || "");
  
  if (!group) {
    return (
      <div className="container py-10 text-center">
        <h1 className="text-3xl font-bold mb-4">Group Not Found</h1>
        <p className="mb-6">The group you're looking for doesn't exist or you don't have access to it.</p>
        <Button onClick={() => navigate("/groups")}>Back to Groups</Button>
      </div>
    );
  }
  
  const isCreator = group.creatorId === user?.id;
  const currentMember = group.members.find(m => m.userId === user?.id);
  const totalPot = group.contributionAmount * group.memberCount;
  const membersReceived = group.members.filter(m => m.hasReceivedPot).length;
  const progressPercentage = (membersReceived / group.memberCount) * 100;
  
  const handleLeaveGroup = async () => {
    await leaveGroup(group.id);
    navigate("/groups");
  };
  
  const handleDeleteGroup = async () => {
    await deleteGroup(group.id);
    navigate("/groups");
  };
  
  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">{group.name}</h1>
          <p className="text-muted-foreground mt-1">{group.description}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            <span>Invite</span>
          </Button>
          
          {isCreator ? (
            <AlertDialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit Group</DropdownMenuItem>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem className="text-destructive">
                      Delete Group
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>
              
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
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Leave group?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to leave this group? You will lose your position and number.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLeaveGroup}>
                    Leave Group
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center">
                  <CircleDollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                  Total Pot
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {group.currency} {totalPot.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {group.currency} {group.contributionAmount} × {group.memberCount} members
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center">
                  <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  Next Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {format(new Date(group.nextDistributionDate), "MMM d, yyyy")}
                </div>
                <p className="text-xs text-muted-foreground">
                  {group.cycleType} distribution
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center">
                  <RefreshCw className="mr-2 h-4 w-4 text-muted-foreground" />
                  Current Cycle
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  Cycle {group.currentCycle}
                </div>
                <p className="text-xs text-muted-foreground">
                  {membersReceived} of {group.memberCount} received
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Distribution Progress</CardTitle>
              <CardDescription>
                Members who have received the pot in the current cycle
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Progress:</span>
                  <span>{membersReceived} of {group.memberCount} members</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-brand-accent h-2.5 rounded-full"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-muted-foreground text-right">
                  {progressPercentage.toFixed(0)}% complete
                </div>
              </div>
            </CardContent>
          </Card>
          
          <GroupMemberList members={group.members} />
        </div>
        
        <div className="space-y-6">
          <NumberSelector group={group} />
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Group Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created On:</span>
                  <span>{format(new Date(group.createdAt), "MMM d, yyyy")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Distribution Cycle:</span>
                  <span className="capitalize">{group.cycleType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contribution Amount:</span>
                  <span>{group.currency} {group.contributionAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Next Distribution:</span>
                  <span>{format(new Date(group.nextDistributionDate), "MMM d, yyyy")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Maximum Members:</span>
                  <span>{group.maxMembers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Cycle:</span>
                  <span>{group.currentCycle}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
