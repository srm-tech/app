import { SearchIcon } from '@heroicons/react/solid';
import clsx from 'clsx';
import { useCombobox } from 'downshift';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import useFetch from 'use-http';

import { debounce } from '@/lib/helper';

import { Search } from '../features/introductions/QuickForm';

export default function ComboSelectAdvanced({ query, onChange, onSelect }) {
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
      debounceSetCurrentValue.current(inputValue);
    },
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) {
        const item: Search = selectedItem;
        onSelect &&
          onSelect(data.find((dataItem) => dataItem._id === item._id));
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
      <div {...getComboboxProps()} className='relative h-full w-1/3'>
        <div className='absolute inset-y-0 left-0 flex items-center pointer-events-none'>
          <SearchIcon className='w-5 h-5' aria-hidden='true' />
        </div>
        <input
          id='search-field'
          className='block w-full h-full py-2 pl-8 pr-3 text-gray-900 placeholder-gray-500 border-transparent focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm'
          {...getInputProps({ value: query })}
          placeholder='Search'
          type='search'
          name='search'
        />
      </div>
      <div className='relative mt-1'>
        <ul
          {...getMenuProps()}
          className='absolute w-1/3 overflow-hidden bg-white rounded-md shadow-md'
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
