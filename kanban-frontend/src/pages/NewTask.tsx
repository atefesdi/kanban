import NewTaskForm from "../components/board/NewTaskForm";
import { useNavigate } from "react-router-dom";
import styles from "./NewTaskPage.module.css";

const NewTaskPage = () => {

  const navigate = useNavigate();

  const handleClose = () => navigate("/");

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        <NewTaskForm />
      </div>
    </div>
  );
};

export default NewTaskPage;
