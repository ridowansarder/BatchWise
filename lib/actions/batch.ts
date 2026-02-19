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
    teacherName: formData.get("teacherName"),
  });

  if (!result.success) {
    return {
      success: false,
      error: result.error.issues[0].message,
    };
  }

  const data = result.data;

  try {
    await prisma.batch.create({
      data: {
        name: data.name,
        capacity: data.capacity,
        teacherName: data.teacherName,
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

  const data = result.data;

  try {
    await prisma.batch.update({
      where: {
        id: batchId,
        orgId,
      },
      data: {
        name: data.name,
        capacity: data.capacity,
        teacherName: data.teacherName,
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
    await prisma.batch.delete({
      where: {
        id: batchId,
        orgId,
      },
    });

    revalidatePath("/dashboard/batches");
    return {
      success: true,
      message: "Batch deleted successfully",
    };
  } catch {
    return {
      success: false,
      error: "Something went wrong",
    };
  }
}
