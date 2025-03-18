
import { Group } from "@/types";
import { GroupMemberList } from "@/components/groups/GroupMemberList";
import { AddMemberForm } from "@/components/groups/AddMemberForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserPlus, Settings } from "lucide-react";

interface MembersTabContentProps {
  group: Group;
  isCreator: boolean;
  onDistribute: (memberId: string) => Promise<void>;
  isLoading: boolean;
}

export function MembersTabContent({ 
  group, 
  isCreator, 
  onDistribute, 
  isLoading 
}: MembersTabContentProps) {
  return (
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
                        onClick={() => onDistribute(member.id)}
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
  );
}
