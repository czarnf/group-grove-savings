
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Group } from "@/types";
import { CalendarClock, CircleDollarSign, Users } from "lucide-react";

interface DashboardStatsProps {
  groups: Group[];
}

export function DashboardStats({ groups }: DashboardStatsProps) {
  // Calculate total pot value across all groups
  const totalPotValue = groups.reduce((total, group) => {
    return total + (group.contributionAmount * group.memberCount);
  }, 0);
  
  // Get upcoming distribution
  const upcomingDistributions = groups
    .map(group => ({
      name: group.name,
      date: new Date(group.nextDistributionDate),
      amount: group.contributionAmount * group.memberCount,
      currency: group.currency
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
  
  const nextDistribution = upcomingDistributions[0];
  
  // Calculate cycle completion percentage
  const calculateCycleCompletion = () => {
    if (groups.length === 0) return 0;
    
    let totalMembers = 0;
    let totalCompleted = 0;
    
    groups.forEach(group => {
      totalMembers += group.memberCount;
      totalCompleted += group.members.filter(m => m.hasReceivedPot).length;
    });
    
    return Math.round((totalCompleted / totalMembers) * 100);
  };
  
  const cycleCompletion = calculateCycleCompletion();
  
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Active Groups
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{groups.length}</div>
          <p className="text-xs text-muted-foreground">
            Saving with {groups.reduce((total, group) => total + group.memberCount, 0)} people
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Pot Value
          </CardTitle>
          <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${totalPotValue.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            Across all your groups
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Next Distribution
          </CardTitle>
          <CalendarClock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {nextDistribution ? (
            <>
              <div className="text-2xl font-bold">
                {nextDistribution.date.toLocaleDateString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {nextDistribution.name}: {nextDistribution.currency} {nextDistribution.amount.toLocaleString()}
              </p>
            </>
          ) : (
            <>
              <div className="text-2xl font-bold">No upcoming</div>
              <p className="text-xs text-muted-foreground">
                Join or create a group to start
              </p>
            </>
          )}
        </CardContent>
      </Card>
      
      <Card className="md:col-span-3">
        <CardHeader className="flex flex-row items-center pb-2">
          <CardTitle className="text-sm font-medium">
            Current Cycle Completion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mt-2 space-y-2">
            <Progress value={cycleCompletion} className="h-2" />
            <p className="text-xs text-muted-foreground text-right">
              {cycleCompletion}% complete across all groups
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
