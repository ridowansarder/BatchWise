import AdminDashboard from "@/components/AdminDashboard";
import TeacherDashboard from "@/components/TeacherDashboard";
import { auth } from "@clerk/nextjs/server";

const DashboardPage = async () => {
  const { has } = await auth();
  const isAdmin = has({ role: "org:admin" });
  return <div>{isAdmin ? <AdminDashboard /> : <TeacherDashboard />}</div>;
};

export default DashboardPage;
