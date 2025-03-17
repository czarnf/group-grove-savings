
import { useState } from "react";
import { useGroups } from "@/contexts/GroupContext";
import { GroupCard } from "@/components/groups/GroupCard";
import { CreateGroupForm } from "@/components/groups/CreateGroupForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function GroupsPage() {
  const { userGroups, loading } = useGroups();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Filter groups based on search query
  const filteredGroups = userGroups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">My Groups</h1>
        
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-60">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search groups..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> New Group
              </Button>
            </DialogTrigger>
            <DialogContent>
              <CreateGroupForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your groups...</p>
        </div>
      ) : filteredGroups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      ) : (
        <div className="bg-muted p-8 rounded-lg text-center">
          {searchQuery ? (
            <>
              <h3 className="text-xl font-medium mb-2">No Results Found</h3>
              <p className="text-muted-foreground mb-4">
                No groups match your search query. Try a different search term.
              </p>
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            </>
          ) : (
            <>
              <h3 className="text-xl font-medium mb-2">No Groups Yet</h3>
              <p className="text-muted-foreground mb-4">
                You haven't joined or created any savings groups yet.
              </p>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Create Your First Group
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <CreateGroupForm />
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      )}
    </div>
  );
}
