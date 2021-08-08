import { useState } from 'react';

const NewItem = () => {
  const [form, setForm] = useState({
    loading: false,
    values: {},
  });
  return <div>NewItem</div>;
};

export default NewItem;
