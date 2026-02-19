import { DeleteStudentModal } from "@/components/DeleteStudentModal";
import { UpdateStudentModal } from "@/components/UpdateStudentModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

const StudentDetailsPage = async ({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) => {
  const { orgId } = await auth();
  const { studentId } = await params;

  if (!orgId) notFound();

  const student = await prisma.student.findFirst({
    where: {
      id: studentId,
      orgId,
    },
    include: {
      batch: true,
    },
  });

  if (!student) notFound();
  return (
    <div className="py-6 px-12 space-y-6 max-w-3xl">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            {student.firstName} {student.lastName}
          </h1>
          <p className="text-muted-foreground mt-1">
            Batch: {student.batch?.name ?? "Not assigned"}
          </p>
        </div>

        <div className="flex gap-2">
          <UpdateStudentModal student={{
            firstName: student.firstName,
            lastName: student.lastName,
            batchId: student.batchId,
            email: student.email ?? undefined,
            phone: student.phone ?? undefined,
            address: student.address ?? undefined,
            dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split('T')[0] : undefined,
            gender: student.gender ?? undefined,
          }} />
          <DeleteStudentModal studentId={student.id} studentName={student.firstName} />
        </div>
      </div>

      {/* Student Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>Student Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p>{student.email ?? "No email provided"}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Phone</p>
            <p>{student.phone ?? "No phone provided"}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Gender</p>
            <p className="capitalize">
              {student.gender
                ? student.gender.toLowerCase()
                : "Not specified"}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Date of Birth</p>
            <p>
              {student.dateOfBirth
                ? new Date(student.dateOfBirth).toLocaleDateString()
                : "Not provided"}
            </p>
          </div>

          <div className="sm:col-span-2">
            <p className="text-sm text-muted-foreground">Address</p>
            <p>{student.address ?? "No address provided"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDetailsPage;
