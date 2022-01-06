import * as React from 'react';
import { useCombobox } from 'downshift';
import { SearchIcon } from '@heroicons/react/solid';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import useFetch from 'use-http';
import InlineError from './errors/InlineError';
import { debounce } from '@/lib/helper';
import { Search } from './introductions/QuickForm';

export default function ComboSelect({ query, onChange, onSelect }) {
  const debounceSetCurrentValue = useRef<any>(null);
  const { get, data, response, loading, error } = useFetch('/search/business');

  let inputItems: Search[] = [];
  if (response.ok) {
    inputItems = data?.map((item) => ({
      _id: item._id,
      label: item.name,
      businessName: item.businessName,
      category: item.businessCategory,
    }));
  }

  const loadData = (value?: string) => {
    const q = value || query || '';
    if (q.length > 0) {
      get(`?q=${q}`);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // debounce function should only be created once
  if (!debounceSetCurrentValue.current) {
    debounceSetCurrentValue.current = debounce((value: string) => {
      loadData(value);
    }, 300);
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
    itemToString: (item: Search | null) => (item ? item.label : ''),
    onInputValueChange: ({ inputValue }: { inputValue?: string }) => {
      onChange && onChange(inputValue || '');
      console.log(222);

      debounceSetCurrentValue.current(inputValue);
    },
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) {
        const item: Search = selectedItem;
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
          type='text'
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
                key={item._id}
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
                      __html: highlightText(item.label),
                    }}
                  ></p>
                  <p
                    className='text-sm text-gray-500'
                    dangerouslySetInnerHTML={{
                      __html: highlightText(
                        `${item.businessName} | ${item.category}`
                      ),
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
