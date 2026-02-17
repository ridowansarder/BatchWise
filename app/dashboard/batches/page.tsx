import { AddBatchModal } from "@/components/AddBatchModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

const BatchesPage = async () => {
  const { orgId, has } = await auth();
  const batches = await prisma.batch.findMany({
    where: {
      orgId: orgId || undefined,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const isAdmin = has({ role: "org:admin" });

  return (
    <div className="py-6 px-12 space-y-5 w-full">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center sm:justify-between ">
        <div>
          <h1 className="text-2xl font-semibold">Batches</h1>
          <p className="text-muted-foreground mt-1">
            {batches.length} {batches.length === 1 ? "batch" : "batches"}{" "}
            available
          </p>
        </div>
        {isAdmin && <AddBatchModal />}
      </div>

      {batches.length === 0 ? (
        <div className="text-center border-2 border-dashed px-4 py-12 mt-4 sm:mt-8 md:mt-12 lg:mt-16">
          <p className="text-muted-foreground">
            No batches yet. Add your first batch.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {batches.map((batch) => (
            <Link key={batch.id} href={`/dashboard/batches/${batch.id}`}>
              <Card>
                <CardHeader>
                  <CardTitle>{batch.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <p className="text-muted-foreground">
                    Capacity: {batch.capacity ? batch.capacity : "Unlimited"}{" "}
                    {batch.capacity === 1 ? "student" : "students"}
                  </p>

                  <p className="text-muted-foreground">
                    Teacher: {batch.teacherName}
                  </p>

                  <p>Click to view details</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default BatchesPage;
