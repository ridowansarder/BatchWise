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
    email: formData.get("email"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    dateOfBirth: formData.get("dateOfBirth"),
    gender: formData.get("gender"),
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

    revalidatePath("/dashboard/students");

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
        error: "A student with this email already exists in your organization",
      };
    }

    return {
      success: false,
      error: "Something went wrong",
    };
  }
}
