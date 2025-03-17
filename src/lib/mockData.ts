
import { Group, Notification, User } from "@/types";

// Mock current user
export const currentUser: User = {
  id: "user-1",
  email: "user@example.com",
  name: "Alex Johnson",
  profilePicture: "https://randomuser.me/api/portraits/men/32.jpg",
  createdAt: new Date("2023-01-15"),
  isEmailVerified: true
};

// Mock groups
export const mockGroups: Group[] = [
  {
    id: "group-1",
    name: "Neighborhood Savings",
    description: "Monthly savings group for our neighborhood community.",
    creatorId: "user-1",
    createdAt: new Date("2023-02-01"),
    memberCount: 6,
    maxMembers: 10,
    contributionAmount: 100,
    currency: "USD",
    cycleType: "monthly",
    nextDistributionDate: new Date(new Date().setDate(new Date().getDate() + 15)),
    numberPool: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    status: "active",
    currentCycle: 3,
    members: [
      {
        id: "member-1",
        userId: "user-1",
        name: "Alex Johnson",
        profilePicture: "https://randomuser.me/api/portraits/men/32.jpg",
        selectedNumber: 5,
        hasReceivedPot: false,
        joinedAt: new Date("2023-02-01")
      },
      {
        id: "member-2",
        userId: "user-2",
        name: "Sarah Williams",
        profilePicture: "https://randomuser.me/api/portraits/women/44.jpg",
        selectedNumber: 3,
        hasReceivedPot: true,
        joinedAt: new Date("2023-02-03")
      },
      {
        id: "member-3",
        userId: "user-3",
        name: "Michael Brown",
        profilePicture: "https://randomuser.me/api/portraits/men/46.jpg",
        selectedNumber: 8,
        hasReceivedPot: false,
        joinedAt: new Date("2023-02-05")
      },
      {
        id: "member-4",
        userId: "user-4",
        name: "Jessica Miller",
        profilePicture: "https://randomuser.me/api/portraits/women/65.jpg",
        selectedNumber: 1,
        hasReceivedPot: true,
        joinedAt: new Date("2023-02-05")
      },
      {
        id: "member-5",
        userId: "user-5",
        name: "David Garcia",
        profilePicture: "https://randomuser.me/api/portraits/men/75.jpg",
        selectedNumber: 9,
        hasReceivedPot: false,
        joinedAt: new Date("2023-02-10")
      },
      {
        id: "member-6",
        userId: "user-6",
        name: "Lisa Rodriguez",
        profilePicture: "https://randomuser.me/api/portraits/women/33.jpg",
        selectedNumber: 6,
        hasReceivedPot: false,
        joinedAt: new Date("2023-02-15")
      }
    ]
  },
  {
    id: "group-2",
    name: "Work Friends Pool",
    description: "Bi-weekly savings pool with coworkers.",
    creatorId: "user-2",
    createdAt: new Date("2023-03-15"),
    memberCount: 4,
    maxMembers: 5,
    contributionAmount: 50,
    currency: "USD",
    cycleType: "bi-weekly",
    nextDistributionDate: new Date(new Date().setDate(new Date().getDate() + 5)),
    numberPool: [1, 2, 3, 4, 5],
    status: "active",
    currentCycle: 2,
    members: [
      {
        id: "member-7",
        userId: "user-1",
        name: "Alex Johnson",
        profilePicture: "https://randomuser.me/api/portraits/men/32.jpg",
        selectedNumber: 4,
        hasReceivedPot: false,
        joinedAt: new Date("2023-03-15")
      },
      {
        id: "member-8",
        userId: "user-7",
        name: "Robert Wilson",
        profilePicture: "https://randomuser.me/api/portraits/men/22.jpg",
        selectedNumber: 2,
        hasReceivedPot: true,
        joinedAt: new Date("2023-03-16")
      },
      {
        id: "member-9",
        userId: "user-8",
        name: "Emily Martinez",
        profilePicture: "https://randomuser.me/api/portraits/women/17.jpg",
        selectedNumber: 5,
        hasReceivedPot: false,
        joinedAt: new Date("2023-03-17")
      },
      {
        id: "member-10",
        userId: "user-9",
        name: "Thomas Anderson",
        profilePicture: "https://randomuser.me/api/portraits/men/36.jpg",
        selectedNumber: 1,
        hasReceivedPot: false,
        joinedAt: new Date("2023-03-18")
      }
    ]
  }
];

// Mock notifications
export const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    userId: "user-1",
    title: "Distribution Coming Soon",
    message: "Neighborhood Savings group will have its distribution in 2 days.",
    type: "info",
    read: false,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
    link: "/groups/group-1"
  },
  {
    id: "notif-2",
    userId: "user-1",
    title: "Number Selection Required",
    message: "Please select your number for the Work Friends Pool.",
    type: "warning",
    read: false,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 2)),
    link: "/groups/group-2"
  },
  {
    id: "notif-3",
    userId: "user-1",
    title: "New Member Joined",
    message: "Lisa Rodriguez has joined Neighborhood Savings.",
    type: "success",
    read: true,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 5)),
    link: "/groups/group-1"
  }
];
