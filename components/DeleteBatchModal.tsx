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
import { DeleteBatch } from "@/lib/actions/batch";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface DeleteBatchModalProps {
  batchId: string;
  batchName: string;
}

export function DeleteBatchModal({
  batchId,
  batchName,
}: DeleteBatchModalProps) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleDeleteBatch = () => {
    startTransition(async () => {
      const result = await DeleteBatch(batchId);

      if (result?.success) {
        toast.success(result.message || "Batch deleted successfully!");
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
        <Button variant="destructive" size="sm" disabled={isPending}>
          Delete Batch
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Batch</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{batchName}</strong>? All
            students in this batch will also be deleted. This action cannot be
            undone.
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
            onClick={handleDeleteBatch}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete Batch"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}