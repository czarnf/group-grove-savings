
import { GroupMember } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Users } from "lucide-react";
import { format } from "date-fns";

interface GroupMemberListProps {
  members: GroupMember[];
  title?: string;
}

export function GroupMemberList({ members, title = "Group Members" }: GroupMemberListProps) {
  // Sort members: first those who haven't received pot, then alphabetically
  const sortedMembers = [...members].sort((a, b) => {
    if (a.hasReceivedPot !== b.hasReceivedPot) {
      return a.hasReceivedPot ? 1 : -1; // Non-received first
    }
    return a.name.localeCompare(b.name); // Alphabetically
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center">
          <Users className="mr-2 h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between py-2"
            >
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={member.profilePicture} />
                  <AvatarFallback>
                    {member.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Joined {format(new Date(member.joinedAt), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium">
                    Number: {member.selectedNumber || "Not selected"}
                  </span>
                  <span className="flex items-center text-xs">
                    {member.hasReceivedPot ? (
                      <span className="text-green-500 flex items-center">
                        <Check className="mr-1 h-3 w-3" /> Received
                      </span>
                    ) : (
                      <span className="text-muted-foreground">
                        Awaiting
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
