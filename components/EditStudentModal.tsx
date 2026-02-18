"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useTransition } from "react";
import { UpdateStudent } from "@/lib/actions/student";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface EditStudentModalProps {
  student: {
    id: string;
    firstName: string;
    lastName: string;
    email: string | null;
    phone: string | null;
    dateOfBirth: string | null;
    gender: "MALE" | "FEMALE" | "OTHER" | null;
    address: string | null;
  };
}

export function EditStudentModal({ student }: EditStudentModalProps) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [gender, setGender] = useState(student.gender || "");
  const router = useRouter();

  const handleUpdateStudent = (formData: FormData) => {
    startTransition(async () => {
      formData.append("studentId", student.id);
      if (gender) formData.append("gender", gender);

      const result = await UpdateStudent(formData);

      if (result?.success) {
        toast.success(result.message || "Student updated successfully!");
        setOpen(false);
        router.refresh();
      } else {
        toast.error(result?.error || "Something went wrong");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={isPending}>
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <form action={handleUpdateStudent} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
            <DialogDescription>
              Update the student details and click save.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            {/* Name */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  disabled={isPending}
                  autoFocus
                  placeholder="Enter first name"
                  defaultValue={student.firstName}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  disabled={isPending}
                  placeholder="Enter last name"
                  defaultValue={student.lastName}
                />
              </div>
            </div>

            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                disabled={isPending}
                placeholder="Enter email (optional)"
                defaultValue={student.email ?? ""}
              />
            </div>

            {/* Phone + Student ID */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="text"
                  disabled={isPending}
                  placeholder="Enter phone number"
                  defaultValue={student.phone ?? ""}
                />
              </div>
            </div>

            {/* DOB + Gender */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  disabled={isPending}
                  defaultValue={student.dateOfBirth ?? ""}
                />
              </div>

              <div className="grid gap-2">
                <Label>Gender</Label>
                <Select
                  value={gender}
                  onValueChange={setGender}
                  disabled={isPending}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Address */}
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                type="text"
                disabled={isPending}
                placeholder="Enter address"
                defaultValue={student.address ?? ""}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button" disabled={isPending}>
                Cancel
              </Button>
            </DialogClose>

            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}