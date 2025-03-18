
import { Group } from "@/types";
import { NumberSelector } from "@/components/groups/NumberSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

interface NumberTabContentProps {
  group: Group;
}

export function NumberTabContent({ group }: NumberTabContentProps) {
  return (
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
  );
}
