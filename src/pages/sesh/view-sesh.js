import { useParams } from 'react-router-dom';

const ViewSesh = () => {
  let { id } = useParams();

  return <div>ViewSesh {id}</div>;
};

export default ViewSesh;
