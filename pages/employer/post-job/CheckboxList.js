import React, { useState } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import { useFormContext } from 'react-hook-form';

const CheckboxList = ({ items, onSelectItem,selectedItems }) => {
    console.log("selectedItems",selectedItems);
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        clearErrors,
        reset,
      } = useFormContext();
      
  const [search, setSearch] = useState('');

  const handleCheckboxChange = (event, item) => {
    
        // console.log("event.target", event.target)
      onSelectItem({name: item.name, id: item.id});     
     
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const filteredItems = items.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <TextField
        type="text"
        placeholder='Search...'
        value={search}
        onChange={handleSearchChange}
        style={{ marginBottom: '20px' }}
      />
      <div style={{display: 'flex', flexDirection: 'column' }}>
        {filteredItems.map((item) => (
          <FormControlLabel
            key={item.id}
            control={
              <Checkbox
                value={item.id}
                {...register(`keywords`)}
                defaultChecked={selectedItems.some(selectedItem => selectedItem.id == item.id)}
                color="primary"
                onChange={(e) => handleCheckboxChange(e, item)}
              />
            }
            label={item.name}
          />
        ))}
      </div>
    </div>
  );
};

export default CheckboxList;