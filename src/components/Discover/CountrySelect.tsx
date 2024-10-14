'use client';

import { useQuery } from '@tanstack/react-query';
import { BsFilterLeft } from 'react-icons/bs';
// import { useState } from 'react';
import Select, { components } from 'react-select';
import styled from 'styled-components';

import { fetchCountries } from '@/lib/mapApi';

interface Country {
  name: string;
  code: string;
  flag: string;
}

const StyledSelect = styled(Select<Country>)`
  .select__control {
    border: 1px solid #ddd;
    border-radius: 25px;
    padding: 8px 15px;
    box-shadow: none;
    text-align: start;
    &:hover {
      /* border-color: #94c3d2; */
      border: 2px solid rgba(63, 82, 227, 0.25);
    }
  }

  .select__indicator-separator {
    display: none;
  }

  .select__option {
    display: flex;
    align-items: center;
    padding: 10px;
    background-color: white;
    color: #333;
    &:hover {
      background-color: #e0f7fa;
      color: #333;
    }
    &.select__option--is-selected {
      background-color: #e0f7fa;
      color: #333;
    }

    img {
      width: 24px;
      height: 24px;
      margin-right: 10px;
      border-radius: 50%;
      object-fit: cover;
    }
  }

  .select__menu {
    border-radius: 16px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .select__single-value {
    display: flex;
    align-items: center;

    img {
      width: 24px;
      height: 24px;
      margin-right: 10px;
      border-radius: 50%;
      object-fit: cover;
    }
  }

  .select__placeholder {
    color: #666;
  }
`;

export default function CountrySelect({ onChange }: { onChange: (selectedOption: { code: string } | null) => void }) {
  const { data: countries = [], isLoading } = useQuery<Country[]>({
    queryKey: ['countries'],
    queryFn: fetchCountries,
    staleTime: 60000,
  });
  const formatOptionLabel = ({ name, flag }: Country) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <img
        src={flag}
        alt={name}
        style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          marginRight: '10px',
          objectFit: 'cover',
        }}
      />
      <span>{name}</span>
    </div>
  );

  const customControl = (props: any) => (
    <components.Control {...props}>
      <BsFilterLeft style={{ marginLeft: '10px', color: '#929494' }} />
      {props.children}
    </components.Control>
  );
  return (
    <StyledSelect
      options={countries}
      getOptionLabel={(option: Country) => option.name}
      getOptionValue={(option: Country) => option.code}
      formatOptionLabel={formatOptionLabel}
      onChange={onChange}
      placeholder="Search for a destination"
      isClearable
      isLoading={isLoading}
      components={{
        Control: customControl,
      }}
      classNamePrefix="select"
    />
  );
}
