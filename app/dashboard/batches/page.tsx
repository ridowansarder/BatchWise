import Link from "next/link";
import { BatchSearch } from "@/components/BatchSearch";
import { AddBatchModal } from "@/components/AddBatchModal";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function BatchesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { orgId, has } = await auth();
  if (!orgId) notFound();

  const { search = "" } = await searchParams;
  const isAdmin = has({ role: "org:admin" });

  const batches = await prisma.batch.findMany({
    where: {
      orgId,
      OR: [{ name: { contains: search, mode: "insensitive" } }],
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="py-6 px-12 space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Batches</h1>
          <p className="text-muted-foreground">Manage and search batches</p>
        </div>
        {isAdmin && <AddBatchModal />}
      </div>

      <BatchSearch />

      <Card>
        <CardHeader>
          <CardTitle>Batch List</CardTitle>
        </CardHeader>
        <CardContent>
          {batches.length === 0 ? (
            <p className="text-muted-foreground">No batches found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left border-b">
                  <tr>
                    <th className="py-2 pr-4">Name</th>
                    <th className="py-2 pr-4">Capacity</th>
                    <th className="py-2 pr-4 hidden sm:table-cell">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {batches.map((batch) => (
                    <tr
                      key={batch.id}
                      className="border-b hover:bg-muted/40 transition"
                    >
                      <td className="py-2 pr-4">
                        <Link
                          href={`/dashboard/batches/${batch.id}`}
                          className="font-medium hover:underline"
                        >
                          {batch.name}
                        </Link>
                      </td>
                      <td className="py-2 pr-4">
                        {batch.capacity
                          ? `${batch.capacity} ${batch.capacity === 1 ? "student" : "students"}`
                          : "Unlimited"}
                      </td>
                      <td className="py-2 pr-4 hidden sm:table-cell">
                        {new Date(batch.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
