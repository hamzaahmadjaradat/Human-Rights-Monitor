import Select from 'react-select';
import { useEffect, useState } from 'react';
import axios from 'axios';

function VictimsSelect({ onChange }) {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/victims') // your API for victims list
      .then(res => {
        setOptions(res.data.map(v => ({ value: v._id, label: v.name || v._id })));
      });
  }, []);

  return (
    <Select
      options={options}
      isMulti
      onChange={(selected) => onChange(selected.map(s => s.value))}
    />
  );
}
