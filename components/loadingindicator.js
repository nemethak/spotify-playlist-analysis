import { usePromiseTracker } from "react-promise-tracker";
import styles from '../styles/LoadingIndicator.module.css';

export const LoadingIndicator = props => {
  const { promiseInProgress } = usePromiseTracker();
  return (
    promiseInProgress &&
    <div className={styles.bouncing_loader}>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );  
}