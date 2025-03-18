
import { Distribution, Group } from "@/types";

export interface GroupContextType {
  groups: Group[];
  userGroups: Group[];
  loading: boolean;
  error: string | null;
  createGroup: (groupData: Partial<Group>) => Promise<Group>;
  joinGroup: (groupId: string) => Promise<void>;
  leaveGroup: (groupId: string) => Promise<void>;
  updateGroup: (groupId: string, groupData: Partial<Group>) => Promise<Group>;
  deleteGroup: (groupId: string) => Promise<void>;
  selectNumber: (groupId: string, number: number) => Promise<void>;
  distributeToMember: (groupId: string, memberId: string) => Promise<Distribution>;
  getGroupById: (groupId: string) => Group | undefined;
  addMemberByEmail: (groupId: string, email: string) => Promise<void>;
}
