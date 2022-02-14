import { StarIcon } from '@heroicons/react/solid';
import { useState } from 'react';
import StarRatingComponent from 'react-star-rating-component';

export default function Rating({
  initialValue = 1,
  name = 'rating',
  size = 10,
  editing = false,
  onStarClick,
}: {
  initialValue: number;
  name?: string;
  size?: number;
  editing?: boolean;
  onStarClick?: any;
}) {
  const [value, setValue] = useState(initialValue || 0);
  return (
    <>
      <StarRatingComponent
        value={value}
        name={name}
        starCount={5}
        emptyStarColor='#ccc'
        starColor='#fa0'
        editing={editing}
        onStarClick={(nextValue) => {
          setValue(nextValue);
          onStarClick && onStarClick(nextValue);
        }}
        renderStarIcon={() => <StarIcon className={`w-${size} h-${size}`} />}
      />
      <input type='hidden' value={value} />
    </>
  );
}