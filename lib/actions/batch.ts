"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "../prisma";
import { batchSchema } from "../validations/batchValidator";
import { Prisma } from "@/app/generated/prisma/client";

export async function CreateBatch(formData: FormData) {
  const { orgId, userId } = await auth();

  if (!userId || !orgId) {
    redirect("/sign-in");
  }

  const result = batchSchema.safeParse({
    name: formData.get("name"),
    capacity: formData.get("capacity"),
    teacherId: formData.get("teacherId") || null,
    teacherName: formData.get("teacherName") || null,
  });

  if (!result.success) {
    return {
      success: false,
      error: result.error.issues[0].message,
    };
  }

  try {
    await prisma.batch.create({
      data: {
        ...result.data,
        teacherName: result.data.teacherName || "",
        orgId,
      },
    });

    revalidatePath("/dashboard/batches");

    return {
      success: true,
      message: "Batch created successfully",
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        error: "A batch with this name already exists",
      };
    }

    return {
      success: false,
      error: "Something went wrong",
    };
  }
}

export async function UpdateBatch(formData: FormData) {
  const { orgId, userId } = await auth();

  if (!userId || !orgId) {
    redirect("/sign-in");
  }

  const batchId = formData.get("batchId") as string;

  if (!batchId) {
    return {
      success: false,
      error: "Batch ID is required",
    };
  }

  const result = batchSchema.safeParse({
    name: formData.get("name"),
    capacity: formData.get("capacity"),
    teacherName: formData.get("teacherName"),
  });

  if (!result.success) {
    return {
      success: false,
      error: result.error.issues[0].message,
    };
  }

  try {
    const batch = await prisma.batch.findFirst({
      where: { id: batchId, orgId },
    });

    if (!batch) {
      return { success: false, error: "Batch not found" };
    }

    await prisma.batch.update({
      where: { id: batch.id },
      data: {
        ...result.data,
        teacherName: result.data.teacherName || "",
      },
    });

    revalidatePath("/dashboard/batches");
    revalidatePath(`/dashboard/batches/${batchId}`);

    return {
      success: true,
      message: "Batch updated successfully",
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        error: "A batch with this name already exists",
      };
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return {
        success: false,
        error: "Batch not found",
      };
    }

    return {
      success: false,
      error: "Something went wrong",
    };
  }
}

export async function DeleteBatch(batchId: string) {
  const { orgId, userId } = await auth();

  if (!userId || !orgId) {
    redirect("/sign-in");
  }

  if (!batchId) {
    return {
      success: false,
      error: "Batch ID is required",
    };
  }

  try {
    const batch = await prisma.batch.findFirst({
      where: { id: batchId, orgId },
    });

    if (!batch) {
      return { success: false, error: "Batch not found" };
    }

    await prisma.batch.delete({ where: { id: batch.id } });

    revalidatePath("/dashboard/batches");

    return {
      success: true,
      message: "Batch deleted successfully",
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return {
        success: false,
        error: "Batch not found",
      };
    }

    return {
      success: false,
      error: "Something went wrong",
    };
  }
}
