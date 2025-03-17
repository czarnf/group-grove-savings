
import { useState } from "react";
import { useGroups } from "@/contexts/GroupContext";
import { GroupCard } from "@/components/groups/GroupCard";
import { CreateGroupForm } from "@/components/groups/CreateGroupForm";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Search } from "lucide-react";

export default function GroupsPage() {
  const { userGroups, loading } = useGroups();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter groups based on search query
  const filteredGroups = userGroups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Groups where user is creator
  const myCreatedGroups = filteredGroups.filter(group => 
    group.creatorId === "user-1" // Note: In a real app, this would be user.id
  );
  
  // Groups where user is a member but not creator
  const joinedGroups = filteredGroups.filter(group => 
    group.creatorId !== "user-1" // Note: In a real app, this would be user.id
  );
  
  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">My Groups</h1>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search groups..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Groups ({filteredGroups.length})</TabsTrigger>
          <TabsTrigger value="created">Created By Me ({myCreatedGroups.length})</TabsTrigger>
          <TabsTrigger value="joined">Joined Groups ({joinedGroups.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
            <CreateGroupForm />
          </div>
          
          {filteredGroups.length === 0 && !loading && (
            <div className="bg-muted p-8 rounded-lg text-center">
              <h3 className="text-xl font-medium mb-2">No Groups Found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? "No groups match your search." : "You haven't joined or created any savings groups yet."}
              </p>
              {searchQuery && (
                <Button onClick={() => setSearchQuery("")}>Clear Search</Button>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="created">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myCreatedGroups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
            <CreateGroupForm />
          </div>
          
          {myCreatedGroups.length === 0 && !loading && (
            <div className="bg-muted p-8 rounded-lg text-center">
              <h3 className="text-xl font-medium mb-2">No Created Groups</h3>
              <p className="text-muted-foreground mb-4">
                You haven't created any savings groups yet.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="joined">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {joinedGroups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
          
          {joinedGroups.length === 0 && !loading && (
            <div className="bg-muted p-8 rounded-lg text-center">
              <h3 className="text-xl font-medium mb-2">No Joined Groups</h3>
              <p className="text-muted-foreground mb-4">
                You haven't joined any savings groups created by others.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
