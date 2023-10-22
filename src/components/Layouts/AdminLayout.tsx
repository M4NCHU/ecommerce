import AdminLayoutStyles from "@/styles/Layouts/AdminLayout.module.css";
import AdminSidebar from "../Admin/Sidebar/AdminSidebar";
import NavBar from "../Admin/Navbar/AdminNavbar";
import { getAuthSession } from "@/lib/auth";
import "@uploadthing/react/styles.css";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = async ({ children }: AdminLayoutProps) => {
  const session = await getAuthSession();

  return (
    <div className={AdminLayoutStyles.AdminLayout}>
      <AdminSidebar />
      <div className={AdminLayoutStyles.AdminRight}>
        <NavBar session={session} />
        <main className={AdminLayoutStyles.AdminMainSection}>
          <div className={AdminLayoutStyles.AdminMainContainer}>{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
