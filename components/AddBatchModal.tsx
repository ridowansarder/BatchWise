"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useTransition } from "react";
import { CreateBatch } from "@/lib/actions/batch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function AddBatchModal() {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleCreateBatch = (formData: FormData) => {
    startTransition(async () => {
      const result = await CreateBatch(formData);

      if (result?.success) {
        toast.success(result.message || "Batch created successfully!");
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
        <Button variant="outline" disabled={isPending}>
          Add Batch
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <form action={handleCreateBatch} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Add Batch</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            {/* Batch Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">Batch Name <span className="text-red-500">**</span></Label>
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
              />
            </div>

            {/* Capacity */}
            <div className="grid gap-2">
              <Label htmlFor="capacity">Capacity (Optional)</Label>
              <Input
                id="capacity"
                name="capacity"
                type="number"
                placeholder="Leave empty for unlimited"
                min={1}
                disabled={isPending}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="teacherName">Teacher Name <span className="text-red-500">**</span></Label>
              <Input
                id="teacherName"
                name="teacherName"
                type="text"
                disabled={isPending}
                minLength={2}
                required
                placeholder="Enter teacher name"
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
