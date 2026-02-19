import { AddStudentModal } from "@/components/AddStudentModal";
import { DeleteBatchModal } from "@/components/DeleteBatchModal";
import { UpdateBatchModal } from "@/components/UpdateBatchModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { notFound } from "next/navigation";

const BatchDetailsPage = async ({
  params,
}: {
  params: Promise<{ batchId: string }>;
}) => {
  const { orgId, has } = await auth();
  const { batchId } = await params;

  const batch = await prisma.batch.findFirst({
    where: { id: batchId, orgId: orgId! },
    include: {
      students: true,
    },
  });

  if (!batch) notFound();

  const isAdmin = has({ role: "org:admin" });

  return (
    <div className="py-6 px-4 sm:px-8 md:px-12 space-y-5 w-full">
      {/* Batch Info */}
      <div className="flex flex-col lg:flex-row gap-3 items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{batch.name}</h1>
          <p className="text-muted-foreground mt-1">
            Teacher: {batch.teacherName}
          </p>
          <p className="text-muted-foreground">
            Capacity:{" "}
            {batch.capacity
              ? `${batch.students.length} / ${batch.capacity} students`
              : "Unlimited"}
          </p>
        </div>

        <div className="flex gap-2">
          {isAdmin && (
            <div className="flex gap-2">
              {" "}
              <UpdateBatchModal
                batch={{
                  name: batch.name,
                  capacity: batch.capacity ?? undefined,
                  teacherName: batch.teacherName,
                }}
                id={batch.id}
              />{" "}
              <DeleteBatchModal batchId={batch.id} batchName={batch.name} />
            </div>
          )}
          {isAdmin &&
            batch.capacity &&
            batch.students.length < batch.capacity && (
              <AddStudentModal batchId={batch.id} />
            )}
        </div>
      </div>

      {/* Students */}
      <div>
        <h2 className="text-lg font-medium mb-1">Students</h2>
        <p className="text-muted-foreground text-sm mb-4">
          {batch.students.length}{" "}
          {batch.students.length === 1 ? "student" : "students"} enrolled
        </p>

        {batch.students.length === 0 ? (
          <div className="text-center border-2 border-dashed px-4 py-12 mt-4 sm:mt-8 md:mt-12 lg:mt-16">
            <p className="text-muted-foreground">
              No students yet. Add your first student.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {batch.students.map((student) => (
              <Card key={student.id}>
                <Link href={`/dashboard/batches/${batch.id}/${student.id}`}>
                  <CardHeader>
                    <CardTitle>
                      {student.firstName} {student.lastName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-2">
                    <p className="text-muted-foreground overflow-hidden">
                      {student.email ?? "No email provided"}
                    </p>
                    <p className="text-muted-foreground">
                      {student.phone ?? "No phone provided"}
                    </p>
                    {student.gender && (
                      <p className="text-muted-foreground capitalize">
                        {student.gender.toLowerCase()}
                      </p>
                    )}
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BatchDetailsPage;
