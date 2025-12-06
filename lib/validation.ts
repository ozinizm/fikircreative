import { z } from "zod";

// Client validation
export const clientSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalı"),
  contact: z.string().min(2, "İletişim kişisi gerekli"),
  email: z.string().email("Geçerli bir email adresi girin"),
  phone: z.string().optional(),
  website: z.string().url("Geçerli bir URL girin").optional().or(z.literal("")),
  address: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "PENDING"]),
  monthlyFee: z.number().min(0, "Ücret negatif olamaz").optional(),
});

// Task validation
export const taskSchema = z.object({
  title: z.string().min(3, "Başlık en az 3 karakter olmalı"),
  description: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "REVIEW", "COMPLETED"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  deadline: z.string().optional(),
  projectId: z.string().optional(),
  assigneeId: z.string().optional(),
  attachments: z.array(z.string()).optional(),
});

// Transaction validation
export const transactionSchema = z.object({
  title: z.string().min(3, "Başlık en az 3 karakter olmalı"),
  amount: z.number().positive("Tutar pozitif olmalı"),
  type: z.enum(["INCOME", "EXPENSE"]),
  description: z.string().optional(),
  status: z.enum(["PENDING", "COMPLETED", "CANCELLED"]).optional(),
  date: z.string().optional(),
  clientId: z.string().optional(),
});

// User validation
export const userSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalı"),
  email: z.string().email("Geçerli bir email adresi girin"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı").optional(),
  role: z.enum(["ADMIN", "USER"]),
  position: z.string().optional(),
  phone: z.string().optional(),
});

// Event validation
export const eventSchema = z.object({
  title: z.string().min(3, "Başlık en az 3 karakter olmalı"),
  description: z.string().optional(),
  type: z.enum(["EVENT", "TASK", "MEETING", "REMINDER"]),
  startDate: z.string(),
  endDate: z.string().optional(),
  location: z.string().optional(),
  color: z.string().optional(),
  allDay: z.boolean().optional(),
  taskId: z.string().optional(),
});

// Report validation
export const reportSchema = z.object({
  title: z.string().min(3, "Başlık en az 3 karakter olmalı"),
  type: z.enum(["MONTHLY", "QUARTERLY", "ANNUAL", "CUSTOM"]),
  content: z.string().min(10, "İçerik en az 10 karakter olmalı"),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  fileUrl: z.string().optional(),
});

// Equipment validation
export const equipmentSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalı"),
  type: z.string().min(2, "Tip gerekli"),
  serialNumber: z.string().optional(),
  purchaseDate: z.string().optional(),
  warranty: z.string().optional(),
  status: z.enum(["AVAILABLE", "IN_USE", "MAINTENANCE", "RETIRED"]),
  notes: z.string().optional(),
});

// Notification validation
export const notificationSchema = z.object({
  title: z.string().min(3, "Başlık en az 3 karakter olmalı"),
  message: z.string().min(5, "Mesaj en az 5 karakter olmalı"),
  type: z.enum(["INFO", "SUCCESS", "WARNING", "ERROR"]).optional(),
  userId: z.string().optional(),
});
