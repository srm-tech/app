import { StarIcon } from '@heroicons/react/solid';
import { useState } from 'react';
import StarRatingComponent from 'react-star-rating-component';

export default function Rating(initialValue) {
  const [value, setValue] = useState(initialValue);
  return (
    <StarRatingComponent
      value={value}
      starCount={5}
      emptyStarColor='#ccc'
      starColor='#fa0'
      editing={true}
      onStarClick={(nextValue) => {
        setValue(nextValue);
      }}
      renderStarIcon={() => <StarIcon className='w-10 h-10' />}
    />
  );
}
