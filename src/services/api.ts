import booksData from "@/data/books.json";
import membersData from "@/data/members.json";
import transactionsData from "@/data/transactions.json";
import reservationsData from "@/data/reservations.json";
import finesData from "@/data/fines.json";
import genresData from "@/data/genres.json";
import type {
  Book,
  Member,
  Transaction,
  Reservation,
  Fine,
  LibraryStats,
} from "@/types";
import { bshengine } from "@/lib/bshengine";

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Load data from JSON (in a real app, this would be from localStorage or API)
let books: Book[] = [...booksData] as Book[];
let members: Member[] = [...membersData] as unknown as Member[];
let transactions: Transaction[] = [...transactionsData] as Transaction[];
let reservations: Reservation[] = [...reservationsData] as Reservation[];
let fines: Fine[] = [...finesData] as Fine[];
const genres: string[] = [...genresData] as string[];
// Books API
export const booksAPI = {
  getAll: async (): Promise<Book[]> => {
    await delay(300);
    // console.log("GET ALL BOOKS:", books.length);
    return books;
  },

  getById: async (id: string): Promise<Book | null> => {
    await delay(200);
    const book = books.find((b) => b.id === id);
    // console.log("GET BOOK BY ID:", id, book);
    return book || null;
  },

  search: async (query: string): Promise<Book[]> => {
    await delay(300);
    const lowerQuery = query.toLowerCase();
    const results = books.filter(
      (b) =>
        b.title.toLowerCase().includes(lowerQuery) ||
        b.author.toLowerCase().includes(lowerQuery) ||
        b.isbn.includes(query)
    );
    // console.log("SEARCH BOOKS:", query, results.length);
    return results;
  },

  create: async (book: Omit<Book, "id">): Promise<Book> => {
    await delay(400);
    const newBook: Book = {
      ...book,
      id: Date.now().toString(),
    };
    books.push(newBook);
    // console.log("CREATE BOOK:", newBook);
    return newBook;
  },

  update: async (id: string, updates: Partial<Book>): Promise<Book> => {
    await delay(400);
    const index = books.findIndex((b) => b.id === id);
    if (index === -1) throw new Error("Book not found");
    books[index] = { ...books[index], ...updates };
    // console.log("UPDATE BOOK:", id, updates);
    return books[index];
  },

  delete: async (id: string): Promise<void> => {
    await delay(300);
    books = books.filter((b) => b.id !== id);
    // console.log("DELETE BOOK:", id);
  },

  getGenres: async (): Promise<string[]> => {
    await delay(100);
    return genres;
  },
};

// Members API
export const membersAPI = {
  getAll: async (): Promise<Member[]> => {
    await delay(300);
    // console.log("GET ALL MEMBERS:", members.length);
    return members;
  },

  getById: async (id: string): Promise<Member | null> => {
    await delay(200);
    const member = members.find((m) => m.id === id);
    // console.log("GET MEMBER BY ID:", id, member);
    return member || null;
  },

  search: async (query: string): Promise<Member[]> => {
    await delay(300);
    const lowerQuery = query.toLowerCase();
    const results = members.filter(
      (m) =>
        m.name.toLowerCase().includes(lowerQuery) ||
        m.email.toLowerCase().includes(lowerQuery) ||
        m.membershipId.toLowerCase().includes(lowerQuery)
    );
    // console.log("SEARCH MEMBERS:", query, results.length);
    return results;
  },

  create: async (member: Omit<Member, "id" | "membershipId">): Promise<Member> => {
    await delay(400);
    const newMember: Member = {
      ...member,
      id: Date.now().toString(),
      membershipId: `MEM${String(members.length + 1).padStart(3, "0")}`,
    };
    members.push(newMember);
    // console.log("CREATE MEMBER:", newMember);
    return newMember;
  },

  update: async (id: string, updates: Partial<Member>): Promise<Member> => {
    await delay(400);
    const index = members.findIndex((m) => m.id === id);
    if (index === -1) throw new Error("Member not found");
    members[index] = { ...members[index], ...updates };
    // console.log("UPDATE MEMBER:", id, updates);
    return members[index];
  },

  delete: async (id: string): Promise<void> => {
    await delay(300);
    members = members.filter((m) => m.id !== id);
    // console.log("DELETE MEMBER:", id);
  },
};

// Transactions API
export const transactionsAPI = {
  getAll: async (): Promise<Transaction[]> => {
    await delay(300);
    // console.log("GET ALL TRANSACTIONS:", transactions.length);
    return transactions;
  },

  getByMemberId: async (memberId: string): Promise<Transaction[]> => {
    await delay(200);
    const memberTransactions = transactions.filter(
      (t) => t.memberId === memberId
    );
    // console.log("GET TRANSACTIONS BY MEMBER:", memberId, memberTransactions.length);
    return memberTransactions;
  },

  getByBookId: async (bookId: string): Promise<Transaction[]> => {
    await delay(200);
    const bookTransactions = transactions.filter((t) => t.bookId === bookId);
    // console.log("GET TRANSACTIONS BY BOOK:", bookId, bookTransactions.length);
    return bookTransactions;
  },

  checkout: async (
    bookId: string,
    memberId: string,
    dueDate: string
  ): Promise<Transaction> => {
    await delay(400);
    const book = books.find((b) => b.id === bookId);
    if (!book || book.availableCopies === 0) {
      throw new Error("Book not available");
    }

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      bookId,
      memberId,
      type: "checkout",
      checkoutDate: new Date().toISOString().split("T")[0],
      dueDate,
      returnDate: null,
      status: "active",
    };

    transactions.push(newTransaction);
    book.availableCopies -= 1;
    if (book.availableCopies === 0) {
      book.status = "checked_out";
    }

    // console.log("CHECKOUT:", newTransaction);
    return newTransaction;
  },

  return: async (transactionId: string): Promise<Transaction> => {
    await delay(400);
    const transaction = transactions.find((t) => t.id === transactionId);
    if (!transaction) throw new Error("Transaction not found");

    transaction.type = "return";
    transaction.returnDate = new Date().toISOString().split("T")[0];
    transaction.status = "returned";

    const book = books.find((b) => b.id === transaction.bookId);
    if (book) {
      book.availableCopies += 1;
      book.status = "available";
    }

    // console.log("RETURN:", transaction);
    return transaction;
  },

  renew: async (transactionId: string, newDueDate: string): Promise<Transaction> => {
    await delay(400);
    const transaction = transactions.find((t) => t.id === transactionId);
    if (!transaction) throw new Error("Transaction not found");

    transaction.dueDate = newDueDate;
    // console.log("RENEW:", transaction);
    return transaction;
  },
};

// Reservations API
export const reservationsAPI = {
  getAll: async (): Promise<Reservation[]> => {
    await delay(300);
    // console.log("GET ALL RESERVATIONS:", reservations.length);
    return reservations;
  },

  getByMemberId: async (memberId: string): Promise<Reservation[]> => {
    await delay(200);
    const memberReservations = reservations.filter(
      (r) => r.memberId === memberId
    );
    // console.log("GET RESERVATIONS BY MEMBER:", memberId, memberReservations.length);
    return memberReservations;
  },

  getByBookId: async (bookId: string): Promise<Reservation[]> => {
    await delay(200);
    const bookReservations = reservations.filter((r) => r.bookId === bookId);
    // console.log("GET RESERVATIONS BY BOOK:", bookId, bookReservations.length);
    return bookReservations;
  },

  create: async (
    bookId: string,
    memberId: string
  ): Promise<Reservation> => {
    await delay(400);
    const existingReservations = reservations.filter(
      (r) => r.bookId === bookId && r.status === "pending"
    );
    const newReservation: Reservation = {
      id: Date.now().toString(),
      bookId,
      memberId,
      reservationDate: new Date().toISOString().split("T")[0],
      status: "pending",
      position: existingReservations.length + 1,
    };

    reservations.push(newReservation);
    // console.log("CREATE RESERVATION:", newReservation);
    return newReservation;
  },

  cancel: async (id: string): Promise<void> => {
    await delay(300);
    const reservation = reservations.find((r) => r.id === id);
    if (reservation) {
      reservation.status = "cancelled";
      // Update positions of other reservations
      reservations
        .filter(
          (r) =>
            r.bookId === reservation.bookId &&
            r.status === "pending" &&
            r.position > reservation.position
        )
        .forEach((r) => r.position--);
    }
    // console.log("CANCEL RESERVATION:", id);
  },
};

// Fines API
export const finesAPI = {
  getAll: async (): Promise<Fine[]> => {
    await delay(300);
    // console.log("GET ALL FINES:", fines.length);
    return fines;
  },

  getByMemberId: async (memberId: string): Promise<Fine[]> => {
    await delay(200);
    const memberFines = fines.filter((f) => f.memberId === memberId);
    // console.log("GET FINES BY MEMBER:", memberId, memberFines.length);
    return memberFines;
  },

  create: async (fine: Omit<Fine, "id">): Promise<Fine> => {
    await delay(400);
    const newFine: Fine = {
      ...fine,
      id: Date.now().toString(),
    };
    fines.push(newFine);
    // console.log("CREATE FINE:", newFine);
    return newFine;
  },

  pay: async (id: string): Promise<Fine> => {
    await delay(400);
    const fine = fines.find((f) => f.id === id);
    if (!fine) throw new Error("Fine not found");
    fine.status = "paid";
    fine.paymentDate = new Date().toISOString().split("T")[0];
    // console.log("PAY FINE:", id);
    return fine;
  },

  waive: async (id: string): Promise<Fine> => {
    await delay(400);
    const fine = fines.find((f) => f.id === id);
    if (!fine) throw new Error("Fine not found");
    fine.status = "paid";
    fine.paymentDate = new Date().toISOString().split("T")[0];
    fine.amount = 0;
    // console.log("WAIVE FINE:", id);
    return fine;
  },
};

// Stats API
export const statsAPI = {
  getLibraryStats: async (): Promise<LibraryStats> => {
    let stats: LibraryStats = {
      totalBooks: 0,
      totalMembers: 0,
      activeCheckouts: 0,
      overdueBooks: 0,
      totalRevenue: 0,
      pendingReservations: 0,
    }

    try {
      const reqs = [
        bshengine.entity('Books').count({}),
        bshengine.user.search<{ count: number }>({
          payload: {
            filters: [
              {field: 'roles', operator: 'ilike', value: 'member'}
            ],
            groupBy: {
              aggregate: [
                {function: 'COUNT', alias: 'count'}
              ]
            }
          }
        }),
        bshengine.entity('Transactions').countFiltered<{ count: number }>({
          payload: {
            filters: [
              {field: 'status', operator: 'eq', value: 'active'}
            ]
          }
        }),
        bshengine.entity('Transactions').countFiltered<{ count: number }>({
          payload: {
            filters: [
              {field: 'status', operator: 'eq', value: 'overdue'}
            ]
          }
        }),
        bshengine.entity('Fines').countFiltered<{ count: number }>({
          payload: {
            filters: [
              {field: 'status', operator: 'eq', value: 'paid'}
            ]
          }
        }),
        bshengine.entity('Reservations').countFiltered<{ count: number }>({
          payload: {
            filters: [
              { field: 'status', operator: 'eq', value: 'pending'}
            ]
          }
        }),
      ]
  
      const [totalBooks, totalMembers, activeCheckouts, overdueBooks, totalRevenue, pendingReservations] = await Promise.all(reqs);

      stats.totalBooks = totalBooks?.data[0]?.count || 0;
      stats.totalMembers = totalMembers?.data[0]?.count || 0;
      stats.activeCheckouts = activeCheckouts?.data[0]?.count || 0;
      stats.overdueBooks = overdueBooks?.data[0]?.count || 0;
      stats.totalRevenue = totalRevenue?.data[0]?.count || 0;
      stats.pendingReservations = pendingReservations?.data[0]?.count || 0;

      console.log(stats);
    } catch (error) {
      console.error('Error fetching library stats:', error);
    }

    return stats;
  },
};

