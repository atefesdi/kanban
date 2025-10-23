import KanbanBoard from "../components/board/KanbanBoard";
import Layout from "../components/layout/layout";

const Home = () => {
  return (
    <Layout pageTitle="My Kanban Board">
      <KanbanBoard />
    </Layout>
  );
};

export default Home;
