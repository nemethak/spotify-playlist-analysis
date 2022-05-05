import { usePromiseTracker } from "react-promise-tracker";

export const LoadingIndicator = props => {
  const { promiseInProgress } = usePromiseTracker();
  return (
    promiseInProgress &&
    <div className="bouncing-loader">
      <div></div>
      <div></div>
      <div></div>
    </div>
  );  
}