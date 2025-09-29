import KanbanBoard from "../components/KanbanBoard"
import styles from "./home.module.css"

const Home = () => {


  return (
    <div className={styles.container}>
      <h1>My Kanban Board</h1>
      <KanbanBoard/>
    </div>
  )
}

export default Home
