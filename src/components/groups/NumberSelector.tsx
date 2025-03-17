
import { useState } from "react";
import { Group } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useGroups } from "@/contexts/GroupContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ListChecks, Loader2 } from "lucide-react";

interface NumberSelectorProps {
  group: Group;
}

export function NumberSelector({ group }: NumberSelectorProps) {
  const { user } = useAuth();
  const { selectNumber } = useGroups();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  
  // Find the current user's member record in the group
  const currentMember = group.members.find(m => m.userId === user?.id);
  
  // Get the already selected numbers by other members
  const takenNumbers = group.members
    .filter(m => m.userId !== user?.id && m.selectedNumber !== null)
    .map(m => m.selectedNumber);
  
  // Handle number selection
  const handleSelectNumber = async (number: number) => {
    setSelectedNumber(number);
  };
  
  // Handle confirmation
  const handleConfirm = async () => {
    if (selectedNumber === null) return;
    
    setIsLoading(true);
    try {
      await selectNumber(group.id, selectedNumber);
    } catch (error) {
      console.error("Error selecting number:", error);
      setSelectedNumber(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  // If user has already selected a number, show the selected number
  if (currentMember?.selectedNumber !== null && currentMember?.selectedNumber !== undefined) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ListChecks className="mr-2 h-5 w-5" />
            Your Number
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6">
          <div className="mb-4">
            <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-brand-primary text-white">
              <span className="text-4xl font-bold">{currentMember.selectedNumber}</span>
            </div>
          </div>
          <p className="text-muted-foreground">
            You've selected number {currentMember.selectedNumber} for this savings group.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ListChecks className="mr-2 h-5 w-5" />
          Select Your Number
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-2 mb-4">
          {group.numberPool.map((number) => {
            const isAvailable = !takenNumbers.includes(number);
            const isSelected = selectedNumber === number;
            
            return (
              <Button
                key={number}
                variant={isSelected ? "default" : isAvailable ? "outline" : "ghost"}
                className={`h-12 ${
                  isAvailable
                    ? isSelected
                      ? "bg-brand-primary text-white"
                      : "hover:bg-brand-primary/10"
                    : "opacity-50 cursor-not-allowed"
                }`}
                onClick={() => isAvailable && handleSelectNumber(number)}
                disabled={!isAvailable || isLoading}
              >
                {isSelected && <Check className="mr-1 h-4 w-4" />}
                {number}
              </Button>
            );
          })}
        </div>
        
        <div className="text-center">
          <Button
            disabled={selectedNumber === null || isLoading}
            onClick={handleConfirm}
            className="w-full"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Confirm Selection"
            )}
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            {selectedNumber === null
              ? "Select a number from the available options"
              : `You've selected number ${selectedNumber}`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
