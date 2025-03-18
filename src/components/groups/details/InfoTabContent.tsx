
import { Group } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

interface InfoTabContentProps {
  group: Group;
  totalPot: number;
}

export function InfoTabContent({ group, totalPot }: InfoTabContentProps) {
  return (
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
  );
}
