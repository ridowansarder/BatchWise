import { DeleteStudentModal } from "@/components/DeleteStudentModal";
import { UpdateStudentModal } from "@/components/UpdateStudentModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import Link from "next/link";

const StudentDetailsPage = async ({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) => {
  const { orgId, has } = await auth();
  const { studentId } = await params;

  if (!orgId) notFound();

  const student = await prisma.student.findFirst({
    where: { id: studentId, orgId },
    include: { batch: true },
  });

  const isAdmin = has({ role: "org:admin" });

  if (!student) notFound();

  const initials =
    `${student.firstName[0]}${student.lastName[0]}`.toUpperCase();

  return (
    <div className="py-6 px-6 sm:px-12 space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-lg font-semibold text-primary">
              {initials}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-semibold">
              {student.firstName} {student.lastName}
            </h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {student.batch ? (
                <Link href={`/dashboard/batches/${student.batch.id}`}>
                  <Badge variant="secondary" className="hover:bg-secondary/80 cursor-pointer">
                    {student.batch.name}
                  </Badge>
                </Link>
              ) : (
                <Badge variant="outline">No batch</Badge>
              )}
              {student.gender && (
                <Badge variant="outline" className="capitalize">
                  {student.gender.toLowerCase()}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {isAdmin && (
          <div className="flex gap-2 shrink-0">
            <UpdateStudentModal
              student={{
                firstName: student.firstName,
                lastName: student.lastName,
                batchId: student.batchId,
                email: student.email ?? undefined,
                phone: student.phone ?? undefined,
                address: student.address ?? undefined,
                dateOfBirth: student.dateOfBirth
                  ? new Date(student.dateOfBirth).toISOString().split("T")[0]
                  : undefined,
                gender: student.gender ?? undefined,
              }}
              studentId={student.id}
            />
            <DeleteStudentModal
              studentId={student.id}
              studentName={student.firstName}
            />
          </div>
        )}
      </div>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Student Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0 divide-y">
          <InfoRow label="Email" value={student.email} />
          <InfoRow label="Phone" value={student.phone} />
          <InfoRow
            label="Date of Birth"
            value={
              student.dateOfBirth
                ? new Date(student.dateOfBirth).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : null
            }
          />
          <InfoRow label="Address" value={student.address} />
          <InfoRow
            label="Enrolled"
            value={new Date(student.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          />
        </CardContent>
      </Card>
    </div>
  );
};

function InfoRow({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex justify-between items-center py-3 gap-4">
      <p className="text-sm text-muted-foreground shrink-0">{label}</p>
      <p className="text-sm font-medium text-right">
        {value ?? <span className="text-muted-foreground font-normal">—</span>}
      </p>
    </div>
  );
}

export default StudentDetailsPage;