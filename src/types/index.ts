import type { BshUser } from "@bshsolutions/sdk/types";

export type UserRole = "admin" | "librarian" | "member";

export interface Book {
  id: string;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  publicationDate: string;
  genre: string;
  description: string;
  totalCopies: number;
  availableCopies: number;
  status: "available" | "checked_out" | "reserved" | "lost" | "damaged";
}

export type Member = BshUser & {
  profile: {
    membershipId: string;
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    joinDate: string;
    status: "active" | "suspended" | "inactive";
    membershipType: "regular" | "premium";
  };
}

export interface Transaction {
  id: string;
  bookId: string;
  memberId: string;
  type: "checkout" | "return";
  checkoutDate: string;
  dueDate: string;
  returnDate: string | null;
  status: "active" | "returned" | "overdue";
}

export interface Reservation {
  id: string;
  bookId: string;
  memberId: string;
  reservationDate: string;
  status: "pending" | "fulfilled" | "cancelled";
  position: number;
}

export interface Fine {
  id: string;
  memberId: string;
  transactionId: string | null;
  amount: number;
  reason: "overdue" | "lost_book" | "damaged_book";
  issueDate: string;
  dueDate: string;
  paymentDate: string | null;
  status: "paid" | "unpaid";
}

export interface LibraryStats {
  totalBooks: number;
  totalMembers: number;
  activeCheckouts: number;
  overdueBooks: number;
  totalRevenue: number;
  pendingReservations: number;
}

