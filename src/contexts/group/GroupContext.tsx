
import { createContext, useContext, useState } from "react";
import { Distribution, Group } from "@/types";
import { mockGroups } from "@/lib/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { GroupContextType } from "./types";
import {
  createGroupOperation,
  joinGroupOperation,
  leaveGroupOperation,
  updateGroupOperation,
  deleteGroupOperation,
  selectNumberOperation,
  distributeToMemberOperation,
  addMemberByEmailOperation,
} from "./operations";

const GroupContext = createContext<GroupContextType | undefined>(undefined);

export function GroupProvider({ children }: { children: React.ReactNode }) {
  const [groups, setGroups] = useState<Group[]>(mockGroups);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
  const userGroups = groups.filter(group => 
    group.members.some(member => member.userId === user?.id)
  );
  
  // Initialize group operations
  const createGroup = createGroupOperation(user, setGroups, setError, setLoading);
  const joinGroup = joinGroupOperation(user, groups, setGroups, setError, setLoading);
  const leaveGroup = leaveGroupOperation(user, groups, setGroups, setError, setLoading);
  const updateGroup = updateGroupOperation(user, groups, setGroups, setError, setLoading);
  const deleteGroup = deleteGroupOperation(user, groups, setGroups, setError, setLoading);
  const selectNumber = selectNumberOperation(user, groups, setGroups, setError, setLoading);
  const distributeToMember = distributeToMemberOperation(user, groups, setGroups, setError, setLoading);
  const addMemberByEmail = addMemberByEmailOperation(user, groups, setGroups, setError, setLoading);
  
  const getGroupById = (groupId: string) => {
    return groups.find(g => g.id === groupId);
  };
  
  return (
    <GroupContext.Provider
      value={{
        groups,
        userGroups,
        loading,
        error,
        createGroup,
        joinGroup,
        leaveGroup,
        updateGroup,
        deleteGroup,
        selectNumber,
        distributeToMember,
        getGroupById,
        addMemberByEmail
      }}
    >
      {children}
    </GroupContext.Provider>
  );
}

export function useGroups() {
  const context = useContext(GroupContext);
  if (context === undefined) {
    throw new Error("useGroups must be used within a GroupProvider");
  }
  return context;
}
