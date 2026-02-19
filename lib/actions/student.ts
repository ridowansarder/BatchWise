"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { studentSchema } from "../validations/studentValidator";
import prisma from "../prisma";
import { Prisma } from "@/app/generated/prisma/client";

export async function CreateStudent(formData: FormData) {
  const { orgId, userId } = await auth();

  if (!userId || !orgId) {
    redirect("/sign-in");
  }

  const result = studentSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email") || undefined,
    phone: formData.get("phone") || undefined,
    address: formData.get("address") || undefined,
    dateOfBirth: formData.get("dateOfBirth") || undefined,
    gender: formData.get("gender") || undefined,
    batchId: formData.get("batchId"),
  });

  if (!result.success) {
    return {
      success: false,
      error: result.error.issues[0].message,
    };
  }

  const data = result.data;

  try {
    await prisma.student.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        orgId,
        batchId: data.batchId,
      },
    });

    revalidatePath("/dashboard/batches");

    return {
      success: true,
      message: "Student created successfully",
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        error: "A student with this email already exists in this batch",
      };
    }

    return {
      success: false,
      error: "Something went wrong",
    };
  }
}

export async function UpdateStudent(formData: FormData) {
  const { orgId, userId } = await auth();

  if (!userId || !orgId) {
    redirect("/sign-in");
  }

  const studentId = formData.get("studentId") as string;

  if (!studentId) {
    return {
      success: false,
      error: "Student ID is required",
    };
  }

  const result = studentSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email") || undefined,
    phone: formData.get("phone") || undefined,
    address: formData.get("address") || undefined,
    dateOfBirth: formData.get("dateOfBirth") || undefined,
    gender: formData.get("gender") || undefined,
    batchId: formData.get("batchId"),
  });

  if (!result.success) {
    return {
      success: false,
      error: result.error.issues[0].message,
    };
  }

  const data = result.data;

  try {
    await prisma.student.update({
      where: {
        id: studentId,
        orgId, // ensure user can only update their own org's students
      },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        batchId: data.batchId,
      },
    });

    revalidatePath("/dashboard/batches");

    return {
      success: true,
      message: "Student updated successfully",
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        error: "A student with this email already exists in this batch",
      };
    }
    return {
      success: false,
      error: "Something went wrong",
    };
  }
}

export async function DeleteStudent(studentId: string) {
  const { orgId, userId } = await auth();

  if (!userId || !orgId) {
    redirect("/sign-in");
  }

  if (!studentId) {
    return {
      success: false,
      error: "Student ID is required",
    };
  }

  try {
    await prisma.student.delete({
      where: {
        id: studentId,
        orgId, // ensure user can only delete their own org's students
      },
    });
    revalidatePath("/dashboard/batches");

    return {
      success: true,
      message: "Student deleted successfully",
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return {
        success: false,
        error: "Student not found",
      };
    }
  }
}
