export type UserRole = "Admin" | "Customer Support";
export type UserStatus = "PENDING" | "Active" | "INACTIVE";

export type ManagedUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  lastLoginDate: string;
  lastLoginTime: string;
  status: UserStatus;
};

export const USER_ROLES: UserRole[] = ["Admin", "Customer Support"];
export const USER_STATUSES: UserStatus[] = ["PENDING", "Active", "INACTIVE"];

export const INITIAL_USERS: ManagedUser[] = [
  {
    id: "u1",
    name: "Abhinav Marda",
    email: "abhinav@IOH.com",
    role: "Admin",
    lastLoginDate: "10 Dec, 2025",
    lastLoginTime: "7:05 PM",
    status: "PENDING",
  },
  {
    id: "u2",
    name: "Leon Serrao",
    email: "leon@IOH.com",
    role: "Admin",
    lastLoginDate: "10 Dec, 2025",
    lastLoginTime: "7:05 PM",
    status: "Active",
  },
  {
    id: "u3",
    name: "Parth Pandav",
    email: "parth@IOH.com",
    role: "Admin",
    lastLoginDate: "10 Dec, 2025",
    lastLoginTime: "7:05 PM",
    status: "Active",
  },
  {
    id: "u4",
    name: "Aryan Jain",
    email: "aryan@IOH.com",
    role: "Customer Support",
    lastLoginDate: "9 Dec, 2025",
    lastLoginTime: "4:22 PM",
    status: "Active",
  },
  {
    id: "u5",
    name: "K. Ramashankarn P C",
    email: "ramashankarn@IOH.com",
    role: "Admin",
    lastLoginDate: "2 Dec, 2025",
    lastLoginTime: "11:18 AM",
    status: "INACTIVE",
  },
  {
    id: "u6",
    name: "Divya Jain",
    email: "divya@IOH.com",
    role: "Customer Support",
    lastLoginDate: "8 Dec, 2025",
    lastLoginTime: "9:41 AM",
    status: "Active",
  },
  {
    id: "u7",
    name: "Raj Patel",
    email: "raj@IOH.com",
    role: "Customer Support",
    lastLoginDate: "10 Dec, 2025",
    lastLoginTime: "7:05 PM",
    status: "Active",
  },
];
