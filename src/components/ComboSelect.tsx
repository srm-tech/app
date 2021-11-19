import * as React from 'react';
import { useCombobox } from 'downshift';
import { SearchIcon } from '@heroicons/react/solid';
import { useState } from 'react';
import clsx from 'clsx';
import useFetch from 'use-http';
import InlineError from './errors/InlineError';
const items = [
  { label: 'Mortgage Brooker & Co', value: '1234' },
  { label: 'Beuaty & Spa', value: '3456' },
  { label: 'ABN group Developments', value: '467' },
];

interface Item {
  id: string;
  label: string;
  businesName: string;
  category: string;
}

export default function ComboSelect({ onSelect }) {
  const [inputValue, setInputValue] = useState('');
  let inputItems: Item[] = [];
  const { data, response, loading, error } = useFetch('/myContacts?q=', {}, []);
  console.log(items);

  if (response.ok) {
    inputItems = data
      ?.map((item) => ({
        id: item._id,
        label: item.name,
        businesName: item.businessName,
        category: item.category,
      }))
      .filter((item) =>
        item.label?.toLowerCase().startsWith(inputValue?.toLowerCase() || '')
      );
  }

  const {
    isOpen,
    selectedItem,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    items: inputItems,
    id: 'ComboSelect',
    inputId: 'ComboSelectInput',
    itemToString: (item: Item | null) => (item ? item.label : ''),
    onInputValueChange: ({ inputValue: value }) => {
      setInputValue(value || '');
    },
    onSelectedItemChange: (val) => {
      onSelect && onSelect(val.selectedItem);
    },
  });

  const highligtText = (label) => {
    const matchStart = label.toLowerCase().indexOf(inputValue?.toLowerCase());
    const matchEnd = matchStart + inputValue?.length - 1;
    const beforeMatch = label.slice(0, matchStart);
    const matchText = label.slice(matchStart, matchEnd + 1);
    const afterMatch = label.slice(matchEnd + 1);
    return (
      beforeMatch +
      '<span class="bg-green-50 font-medium">' +
      matchText +
      '</span>' +
      afterMatch
    );
  };

  return (
    <>
      <div {...getComboboxProps()} className='relative'>
        <input
          {...getInputProps()}
          type='text'
          // onChange={(e) => setInputValue(e.target.value)}
          // value={inputValue}
          className='block w-full border-gray-300 border-2 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
        />
        <InlineError message={error?.message} />
        <button
          type='button'
          {...getToggleButtonProps()}
          aria-label={'toggle menu'}
          className='absolute right-2 top-2.5 text-gray-400'
        >
          <SearchIcon className='w-5 h-5' />
        </button>
      </div>
      <div className='relative mt-1'>
        <ul
          {...getMenuProps()}
          className='absolute bg-white w-full shadow-md rounded-md overflow-hidden'
        >
          {isOpen &&
            inputItems.map((item, index) => (
              <li
                key={item.id}
                className={clsx(
                  'p-2',
                  highlightedIndex === index ? 'bg-gray-100' : 'bg-gray-50'
                )}
                {...getItemProps({ item, index })}
              >
                {/* <img className="h-10 w-10 rounded-full" src={person.image} alt="" /> */}
                <div className='ml-3'>
                  <p
                    className='text-sm font-medium text-gray-900'
                    dangerouslySetInnerHTML={{
                      __html: highligtText(item.label),
                    }}
                  ></p>
                  <p className='text-sm text-gray-500'>
                    {item.businesName} | {item.category}
                  </p>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </>
  );
}
