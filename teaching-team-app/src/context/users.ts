import { userApi } from "@/services/api"; 

// user type
export interface User {
  id: number;
  fullName: string;
  email: string;
  password: string;
  role: string;
}

export type Course = {
  id: number;
  lecturerId: number;
  courseCode: string;
  courseName: string;
}

// src/context/users.ts
export interface Application {
  id: number;
  courseCode: string;
  name: string;
  previousRole: string;
  role: string;           // matches `role` column
  skills: string[];       // matches `skills` column
  availability: string;
  academics: string;      // matches `academics` column
  candidate: number;      // foreign key → “candidate_id”
  status: number;
  createdAt: string;
  chosen: boolean;
  ranking?: number;
  comment?: string;
  // …any other fields your entity includes…
}

