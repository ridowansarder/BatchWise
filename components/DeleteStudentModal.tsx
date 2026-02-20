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
import { useState, useTransition } from "react";
import { DeleteStudent } from "@/lib/actions/student";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface DeleteStudentModalProps {
  studentId: string;
  studentName: string;
}

export function DeleteStudentModal({
  studentId,
  studentName,
}: DeleteStudentModalProps) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleDeleteStudent = () => {
    startTransition(async () => {
      const result = await DeleteStudent(studentId);

      if (result?.success) {
        toast.success(result.message || "Student deleted successfully!");
        setOpen(false);
        router.push("/dashboard/batches");
        router.refresh();
      } else {
        toast.error(result?.error || "Something went wrong");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" disabled={isPending}>
          Delete
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Student</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{studentName}</strong>? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button" disabled={isPending}>
              Cancel
            </Button>
          </DialogClose>

          <Button
            variant="destructive"
            onClick={handleDeleteStudent}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}