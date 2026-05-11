import {
  Building2Icon,
  ClipboardCheckIcon,
  LayoutDashboardIcon,
  LayoutGridIcon,
  ShieldCheck,
  UserRoundIcon,
} from "lucide-react";
import { Card, CardHeader } from "./ui/card";

const features = [
  {
    title: "Role-Based Access",
    description:
      "Admins get full control. Teachers see only their assigned batches.",
    icon: ShieldCheck,
  },
  {
    title: "Batch Management",
    description:
      "Create batches, assign students, and manage everything from a single dashboard.",
    icon: LayoutGridIcon,
  },
  {
    title: "Attendance Tracking",
    description:
      "Mark attendance per batch, view 30-day history, and track each student's record with full visibility.",
    icon: ClipboardCheckIcon,
  },
  {
    title: "Multi-Tenant Coaching Center Management System",
    description:
      "Each coaching center gets its own isolated workspace. Powered by Clerk organizations for secure data separation.",
    icon: Building2Icon,
  },
  {
    title: "Student Profiles",
    description:
      "Maintain a central student list with individual detail pages. Edit profiles and track batch enrollment easily.",
    icon: UserRoundIcon,
  },
  {
    title: "Separate Dashboards",
    description:
      "Admins and teachers land in their own tailored views. No clutter, no confusion — just what each role needs.",
    icon: LayoutDashboardIcon,
  },
];

const HomeSections = () => {
  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <p className="text-sm tracking-widest uppercase text-muted-foreground mb-8">
        Core Features
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 rounded-lg overflow-hidden gap-3">
        {features.map((f) => (
          <Card key={f.title} className="p-6">
            <CardHeader key={f.title} className="p-6 ">
              <div className="text-primary mb-3">
                <f.icon size={24} />
              </div>
              <h3 className="text-sm font-semibold text-card-foreground mb-1.5">
                {f.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {f.description}
              </p>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default HomeSections;
