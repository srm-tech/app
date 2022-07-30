import { CheckCircleIcon, SearchIcon } from '@heroicons/react/solid';
import clsx from 'clsx';
import { useCombobox } from 'downshift';
import * as React from 'react';
import { useRef } from 'react';

import { classNames } from '@/lib/helper';

import InlineError from './errors/InlineError';
import Spinner from './Spinner';

export interface ComboSearch {
  _id: string;
  label: string;
  description: string;
}

interface ComboProps {
  query: string;
  onChange: (q: string) => void;
  onSelect: (item: ComboSearch | null) => void;
  isLoading: boolean;
  inputItems: ComboSearch[];
  error: string;
  value: ComboSearch | null;
}

export default function ComboSelect<T>({
  query,
  onChange,
  onSelect,
  isLoading,
  inputItems,
  error,
  value,
}: ComboProps) {
  const currentValue = useRef<any>(null);

  const {
    isOpen,
    getToggleButtonProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    items: inputItems,
    id: 'ComboSelect',
    inputId: 'ComboSelectInput',
    itemToString: (item: ComboSearch | null) => (item ? item.label : ''),
    onInputValueChange: ({ inputValue }: { inputValue?: string }) => {
      if (inputValue !== currentValue.current) {
        onChange && onChange(inputValue || '');
        onSelect && onSelect(null);
      }
      currentValue.current = inputValue;
    },
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) {
        currentValue.current = selectedItem.label;
        const item: ComboSearch = selectedItem;
        onSelect && onSelect(item);
        onChange && onChange(item.label || '');
      }
    },
  });

  const highlightText = React.useCallback(
    (label) => {
      const matchStart = label.toLowerCase().indexOf(query?.toLowerCase());
      if (matchStart === -1) {
        return label;
      }
      const matchEnd = matchStart + query?.length - 1;
      const beforeMatch = label.slice(0, matchStart);
      const matchText = label.slice(matchStart, matchEnd + 1);
      const afterMatch = label.slice(matchEnd + 1);
      return (
        beforeMatch +
        '<span class="bg-green-100 font-medium">' +
        matchText +
        '</span>' +
        afterMatch
      );
    },
    [query]
  );

  return (
    <>
      <div {...getComboboxProps()} className='relative'>
        <input
          {...getInputProps({ value: query })}
          type='search'
          className='block w-full border-2 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm appearance-none'
        />
        <InlineError message={error} />
        <button
          type='button'
          {...getToggleButtonProps()}
          aria-label={'toggle menu'}
          className='absolute right-2 top-2.5 text-gray-400'
        >
          {value ? (
            <CheckCircleIcon className={classNames('w-5 h-5 text-green-700')} />
          ) : isLoading ? (
            <Spinner className='w-5 h-5' />
          ) : (
            <SearchIcon className={classNames('w-5 h-5')} />
          )}
        </button>
      </div>
      <div className='relative mt-1'>
        <ul
          {...getMenuProps()}
          className='absolute w-full overflow-hidden bg-white rounded-md shadow-md'
        >
          {isOpen &&
            inputItems.map((item, index) => (
              <li
                key={item._id}
                className={clsx(
                  'p-2',
                  highlightedIndex === index ? 'bg-gray-100' : 'bg-gray-50'
                )}
                {...getItemProps({ item, index })}
              >
                {/* <img className="w-10 h-10 rounded-full" src={person.image} alt="" /> */}
                <div className='ml-3'>
                  <p
                    className='text-sm font-medium text-gray-900'
                    dangerouslySetInnerHTML={{
                      __html: highlightText(item.label),
                    }}
                  ></p>
                  <p
                    className='text-sm text-gray-500'
                    dangerouslySetInnerHTML={{
                      __html: highlightText(item.description),
                    }}
                  ></p>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </>
  );
}
