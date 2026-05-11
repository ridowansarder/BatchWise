# BatchWise – Coaching Center Management System

BatchWise is a modern coaching center management system designed to streamline student, batch, and attendance management. It provides role-based dashboards for admins and teachers, ensuring proper access control and efficient workflow within an educational institute.

---

## Tech Stack

* **Frontend & Backend:** Next.js 16 (App Router)
* **Database ORM:** Prisma
* **Database:** Neon (Serverless Postgres)
* **Authentication & Multi-tenancy:** Clerk
* **Architecture:** Multi-tenant SaaS

---

## Core Features

### 1. Role-Based Access Control

BatchWise supports two main roles:

* **Admin**

  * Full access to all batches and students
  * Can create, edit, and manage batches
  * Can mark attendance for any batch
* **Teacher**

  * Limited access
  * Can only mark attendance for batches assigned to them
  * Cannot create or manage batches

---

### 2. Dashboards

Separate dashboards are provided for:

* **Admins** → Full system control
* **Teachers** → Restricted, batch-specific functionality

---

### 3. Student Management

* Central **Students List Page**

  * Displays all students in the coaching center
* **Student Details Page**

  * View individual student information
  * Edit student details

---

### 4. Batch Management

* **Batch List Page**

  * Shows all batches
  * “Create New Batch” button (Admin only)
* **Batch Details Page**

  * View students in a batch
  * Edit batch details (Admin)
  * Add students to batch (Admin)

---

### 5. Attendance System

* **Attendance Page**

  * Displays available batches
  * Teachers see only their assigned batches
* **Mark Attendance**

  * Select a batch and mark attendance for students
* **Attendance History**

  * View last **30 days’ records**
  * Student-wise attendance tracking per batch

---

## Multi-Tenancy

BatchWise uses Clerk’s multi-tenant system, allowing:

* Multiple coaching centers (organizations)
* Data isolation between tenants
* Role-based access within each organization

---

## Project Structure (High-Level)

```
app/
  dashboard/
  students/
  batches/
  attendance/

components/
lib/
  prisma/
  auth/
```

---

## Key Functional Flow

1. User logs in via Clerk
2. Role (Admin/Teacher) determines dashboard access
3. Admin manages:

   * Students
   * Batches
4. Teachers:

   * Access assigned batches
   * Mark attendance
5. Attendance history provides insights for the last 30 days

---

## Permissions Overview

| Feature         | Admin | Teacher           |
| --------------- | ----- | ----------------- |
| View Students   | ✅     | ✅                 |
| Edit Students   | ✅     | ❌                 |
| Create Batch    | ✅     | ❌                 |
| Edit Batch      | ✅     | ❌                 |
| Mark Attendance | ✅     | ✅ (assigned only) |
| View Attendance | ✅     | ✅                 |

---

## Future Improvements

* Analytics dashboard (attendance trends, performance)
* Fee management system
* Notifications (SMS/Email)
* Parent portal

---

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Setup environment variables:

* Clerk keys
* Database URL (Neon)
* Prisma configuration

4. Run migrations:

```bash
npx prisma migrate dev
```

5. Start development server:

```bash
npm run dev
```

---

## Summary

BatchWise simplifies coaching center operations by combining modern web technologies with a clear role-based system. It ensures that admins maintain full control while teachers focus only on their assigned responsibilities, making the workflow efficient and scalable.
