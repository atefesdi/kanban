import React from "react";
import KanbanBoard from "../components/KanbanBoard";
import styles from "./home.module.css";

const Home = () => {
  return (
    <div className={styles.appContainer}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <h2 className={styles.brand}>KanbanApp</h2>
        <nav className={styles.nav}>
          <a href="#" className={styles.navLink}>Dashboard</a>
          <a href="#" className={styles.navLink}>Projects</a>
          <a href="#" className={styles.navLink}>Tasks</a>
          <a href="#" className={styles.navLink}>Settings</a>
        </nav>
      </aside>

      {/* Main content */}
      <div className={styles.mainContent}>
        {/* Navbar */}
        <header className={styles.navbar}>
          <h1 className={styles.title}>My Kanban Board</h1>
          <div className={styles.userSection}>
            <span>Ati</span>
            <button className={styles.logoutBtn}>Logout</button>
          </div>
        </header>

        {/* Kanban Board */}
        <main className={styles.boardContainer}>
          <KanbanBoard />
        </main>
      </div>
    </div>
  );
};

export default Home;

