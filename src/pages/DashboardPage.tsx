
import { useGroups } from "@/contexts/GroupContext";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { GroupCard } from "@/components/groups/GroupCard";
import { CreateGroupForm } from "@/components/groups/CreateGroupForm";

export default function DashboardPage() {
  const { userGroups, loading } = useGroups();
  
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {/* Dashboard Stats */}
      <DashboardStats groups={userGroups} />
      
      {/* Recent Groups */}
      <h2 className="text-2xl font-bold mt-10 mb-4">Your Groups</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userGroups.slice(0, 5).map((group) => (
          <GroupCard key={group.id} group={group} />
        ))}
        
        <CreateGroupForm />
      </div>
      
      {userGroups.length === 0 && !loading && (
        <div className="bg-muted p-8 rounded-lg text-center">
          <h3 className="text-xl font-medium mb-2">No Groups Yet</h3>
          <p className="text-muted-foreground mb-4">
            You haven't joined or created any savings groups yet.
          </p>
        </div>
      )}
    </div>
  );
}
