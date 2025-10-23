import { useState } from "react";
import type { ReactNode } from "react";
import styles from "./layout.module.css";
import {
  FaTachometerAlt,
  FaProjectDiagram,
  FaTasks,
  FaCog,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

interface LayoutProps {
  children: ReactNode;
  pageTitle?: string;
}

const Layout = ({ children, pageTitle = "My Kanban Board" }: LayoutProps) => {
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const logoutHandler = () => logout();

  return (
    <div className={styles.appContainer}>
      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${
          sidebarOpen ? styles.open : styles.closed
        }`}
      >
        <div className={styles.sidebarHeader}>
          {sidebarOpen && <h2 className={styles.brand}>KanbanApp</h2>}
          <button
            className={`${styles.menuBtn} ${sidebarOpen ? styles.active : ""}`}
            onClick={toggleSidebar}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <nav className={styles.nav}>
          <a href="/home" className={styles.navLink}>
            <FaTachometerAlt /> <span>Dashboard</span>
          </a>
          <a href="/projects" className={styles.navLink}>
            <FaProjectDiagram /> <span>Projects</span>
          </a>
          <a href="/tasks" className={styles.navLink}>
            <FaTasks /> <span>Tasks</span>
          </a>
          <a href="/profile" className={styles.navLink}>
            <FaUserCircle /> <span>Profile</span>
          </a>
          <a href="/settings" className={styles.navLink}>
            <FaCog /> <span>Settings</span>
          </a>
        </nav>

        <button onClick={logoutHandler} className={styles.logoutBtn}>
          <FaSignOutAlt /> <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <header className={styles.navbar}>
          <h1 className={styles.title}>{pageTitle}</h1>

          <div className={styles.userSection}>
            <div className={styles.userInfo}>
              <span className={styles.username}>Ati</span>
            </div>
            <FaUserCircle className={styles.userAvatar} />
          </div>
        </header>

        <main className={styles.boardContainer}>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
