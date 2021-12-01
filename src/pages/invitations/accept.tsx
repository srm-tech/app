import React from 'react';
import useFetch from 'use-http';

export default function accept() {
  const options = [];
  const {
    loading,
    error,
    data = [],
  } = useFetch(process.env.BASE_URL + '/api/invitations/accept', options, []);
}
