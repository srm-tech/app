import { StarIcon } from '@heroicons/react/solid';
import { useState } from 'react';
import StarRatingComponent from 'react-star-rating-component';

export default function Rating(initialValue = 1, name = 'rating', size = '10') {
  const [value, setValue] = useState(initialValue);
  return (
    <>
      <StarRatingComponent
        value={value}
        starCount={5}
        emptyStarColor='#ccc'
        starColor='#fa0'
        editing={true}
        onStarClick={(nextValue) => {
          setValue(nextValue);
        }}
        renderStarIcon={() => <StarIcon className={`w-${size} h-${size}`} />}
      />
      <input type='hidden' name={name} value={value} />
    </>
  );
}
