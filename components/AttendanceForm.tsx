"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MarkAttendance } from "@/lib/actions/attendance";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  studentId: string | null;
}

interface AttendanceFormProps {
  batchId: string;
  students: Student[];
  selectedDate: string;
  existingAttendance: Map<string, AttendanceStatus>;
}

export function AttendanceForm({
  batchId,
  students,
  selectedDate,
  existingAttendance,
}: AttendanceFormProps) {
  const [isPending, startTransition] = useTransition();
  const [date, setDate] = useState(selectedDate);
  const [attendance, setAttendance] = useState<Map<string, AttendanceStatus>>(
    new Map(existingAttendance)
  );
  const router = useRouter();

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendance(new Map(attendance.set(studentId, status)));
  };

  const markAllAs = (status: AttendanceStatus) => {
    const newAttendance = new Map(attendance);
    students.forEach((student) => {
      newAttendance.set(student.id, status);
    });
    setAttendance(newAttendance);
  };

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await MarkAttendance(formData);

      if (result?.success) {
        toast.success(result.message || "Attendance marked successfully!");
        router.push("/dashboard/batches");
        router.refresh();
      } else {
        toast.error(result?.error || "Something went wrong");
      }
    });
  };

  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    router.push(`?date=${newDate}`);
  };

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case "PRESENT":
        return "bg-green-500 hover:bg-green-600";
      case "ABSENT":
        return "bg-red-500 hover:bg-red-600";
      case "LATE":
        return "bg-yellow-500 hover:bg-yellow-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const stats = {
    present: Array.from(attendance.values()).filter((s) => s === "PRESENT")
      .length,
    absent: Array.from(attendance.values()).filter((s) => s === "ABSENT")
      .length,
    late: Array.from(attendance.values()).filter((s) => s === "LATE").length,
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      <input type="hidden" name="batchId" value={batchId} />
      <input type="hidden" name="date" value={date} />

      {/* Date and Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end justify-between">
        <div className="grid gap-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => handleDateChange(e.target.value)}
            disabled={isPending}
            className="w-fit"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => markAllAs("PRESENT")}
            disabled={isPending}
          >
            Mark All Present
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => markAllAs("ABSENT")}
            disabled={isPending}
          >
            Mark All Absent
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {stats.present}
            </div>
            <p className="text-xs text-muted-foreground">Present</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">
              {stats.absent}
            </div>
            <p className="text-xs text-muted-foreground">Absent</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">
              {stats.late}
            </div>
            <p className="text-xs text-muted-foreground">Late</p>
          </CardContent>
        </Card>
      </div>

      {/* Student List */}
      <div className="space-y-3">
        {students.map((student) => {
          const status = attendance.get(student.id) || "PRESENT";
          return (
            <Card key={student.id}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">
                      {student.firstName} {student.lastName}
                    </p>
                    {student.studentId && (
                      <p className="text-sm text-muted-foreground">
                        Reg No: {student.studentId}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="hidden"
                      name="studentId"
                      value={student.id}
                    />
                    <input
                      type="hidden"
                      name={`status-${student.id}`}
                      value={status}
                    />

                    {(["PRESENT", "ABSENT", "LATE"] as const).map(
                      (s) => (
                        <Button
                          key={s}
                          type="button"
                          size="sm"
                          variant={status === s ? "default" : "outline"}
                          className={status === s ? getStatusColor(s) : ""}
                          onClick={() => handleStatusChange(student.id, s)}
                          disabled={isPending}
                        >
                          {s.charAt(0) + s.slice(1).toLowerCase()}
                        </Button>
                      )
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending} size="lg">
          {isPending ? "Saving..." : "Save Attendance"}
        </Button>
      </div>
    </form>
  );
}