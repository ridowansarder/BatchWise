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
import { CreateStudent } from "@/lib/actions/student";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function AddStudentModal({ batchId }: { batchId: string }) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [gender, setGender] = useState("male");

  const handleCreateStudent = (formData: FormData) => {
    startTransition(async () => {
      formData.append("batchId", batchId);
      const result = await CreateStudent(formData);

      if (result?.success) {
        toast.success(result.message || "Student created successfully!");
        setOpen(false);
        router.refresh();
      } else {
        toast.error(result?.error || "Something went wrong");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} modal>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={isPending}>
          Add Student
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <form action={handleCreateStudent} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Add Student</DialogTitle>
            <DialogDescription>
              Fill in the student details and click create.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            {/* Name */}
            <div className="grid gap-3 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name <span className="text-red-500">**</span></Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  disabled={isPending}
                  placeholder="Enter first name"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name <span className="text-red-500">**</span></Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  disabled={isPending}
                  placeholder="Enter last name"
                />
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  disabled={isPending}
                  placeholder="Enter email (optional)"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="text"
                  disabled={isPending}
                  placeholder="Enter phone number (optional)"
                />
              </div>
            </div>

            {/* DOB + Gender */}
            <div className="grid gap-3 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  disabled={isPending}
                />
              </div>

              <div className="grid gap-2">
                <Label>Gender</Label>
                <input type="hidden" name="gender" value={gender} />

                <Select
                  onValueChange={setGender} 
                  defaultValue={gender}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
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
              {isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
