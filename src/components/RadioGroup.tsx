interface Item {
  id: string;
  label: string;
}

export default function RadioGroup({ options }: { options: Item[] }) {
  return (
    <fieldset>
      <legend className='sr-only'>Notification method</legend>
      <div className='space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-4'>
        {options.map((option) => (
          <div key={option.id} className='flex items-center'>
            <input
              id={option.id}
              name='notification-method'
              type='radio'
              defaultChecked={option.id === 'email'}
              className='focus:ring-primary-400 h-5 w-5 text-primary-400 border-gray-300'
            />
            <label
              htmlFor={option.id}
              className='ml-3 block text-sm font-medium text-gray-700'
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </fieldset>
  );
}
