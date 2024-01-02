"use client";

import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ViewToggle() {
  const [alignment, setAlignment] = React.useState<string | null>('left');

  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string | null,
  ) => {
    setAlignment(newAlignment);
  };

  return (
    <ToggleButtonGroup
      value={alignment}
      exclusive
      onChange={handleAlignment}
      size="small"
      className='rounded-lg'
    >
      <ToggleButton value="left" className='font-serif'>
        
      </ToggleButton>
      <ToggleButton value="right" className='font-serif'>
        unselected
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
