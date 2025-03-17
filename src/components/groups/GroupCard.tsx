
import { CalendarIcon, Users } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Group } from "@/types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface GroupCardProps {
  group: Group;
}

export function GroupCard({ group }: GroupCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const isCreator = group.creatorId === user?.id;
  const currentUserMember = group.members.find(m => m.userId === user?.id);
  const totalPot = group.contributionAmount * group.memberCount;
  
  const handleViewGroup = () => {
    navigate(`/groups/${group.id}`);
  };
  
  const memberReceived = group.members.filter(m => m.hasReceivedPot).length;
  const progressPercentage = (memberReceived / group.memberCount) * 100;
  
  return (
    <Card className="cursor-pointer card-hover h-full flex flex-col" onClick={handleViewGroup}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{group.name}</CardTitle>
          {isCreator && (
            <span className="bg-brand-accent/10 text-brand-accent text-xs font-medium px-2.5 py-0.5 rounded">
              Admin
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{group.description}</p>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-1">
              <Users size={16} className="text-muted-foreground" />
              <span>{group.memberCount} members</span>
            </div>
            <div className="flex items-center gap-1">
              <CalendarIcon size={16} className="text-muted-foreground" />
              <span>{format(new Date(group.nextDistributionDate), "MMM d, yyyy")}</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Pot Total:</span>
              <span className="font-medium">
                {group.currency} {totalPot.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Your Number:</span>
              <span className="font-medium">
                {currentUserMember?.selectedNumber || "Not selected"}
              </span>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Cycle Progress:</span>
              <span>{memberReceived} of {group.memberCount} received</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-brand-accent h-2.5 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button variant="outline" className="w-full">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
