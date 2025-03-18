
import { Group } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleDollarSign, Calendar, Clock, Users } from "lucide-react";
import { format } from "date-fns";

interface GroupStatCardsProps {
  group: Group;
}

export function GroupStatCards({ group }: GroupStatCardsProps) {
  const totalPot = group.contributionAmount * group.memberCount;
  
  return (
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
  );
}
