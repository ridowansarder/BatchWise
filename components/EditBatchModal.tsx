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
import { useState, useTransition } from "react";
import { UpdateBatch } from "@/lib/actions/batch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface EditBatchModalProps {
  batch: {
    id: string;
    name: string;
    capacity: number | null;
    teacherName: string;
  };
}

export function EditBatchModal({ batch }: EditBatchModalProps) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleUpdateBatch = (formData: FormData) => {
    startTransition(async () => {
      formData.append("batchId", batch.id);
      const result = await UpdateBatch(formData);

      if (result?.success) {
        toast.success(result.message || "Batch updated successfully!");
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
        <Button disabled={isPending}>
          Edit Batch
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <form action={handleUpdateBatch} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Edit Batch</DialogTitle>
            <DialogDescription>
              Update the batch details for your coaching center.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            {/* Batch Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">Batch Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter batch name"
                minLength={2}
                maxLength={100}
                type="text"
                required
                disabled={isPending}
                autoFocus
                defaultValue={batch.name}
              />
            </div>

            {/* Capacity */}
            <div className="grid gap-2">
              <Label htmlFor="capacity">Capacity (Optional)</Label>
              <Input
                id="capacity"
                name="capacity"
                type="text"
                placeholder="Enter capacity"
                disabled={isPending}
                defaultValue={batch.capacity?.toString() ?? ""}
              />
            </div>

            {/* Teacher Name */}
            <div className="grid gap-2">
              <Label htmlFor="teacherName">Teacher Name</Label>
              <Input
                id="teacherName"
                name="teacherName"
                placeholder="Enter teacher name"
                disabled={isPending}
                defaultValue={batch.teacherName}
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
              {isPending ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}