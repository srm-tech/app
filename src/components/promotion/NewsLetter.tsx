import * as React from 'react';

const scriptURL =
  'https://hook.integromat.com/ndb1abbohl44oi2xsn23lhb7a1pvh3n5';

export default function NewsLetter() {
  const [contact, setContact] = React.useState('');
  const [name, setName] = React.useState('');
  const _handleSubmit = (e) => {
    if (contact.length > 2) {
      e.preventDefault();

      const formdData = new FormData();
      formdData.append('name', name);
      formdData.append('contact', contact);
      formdData.append('type', 'Promotion Signup');

      fetch(scriptURL, {
        method: 'POST',
        body: formdData,
      })
        .then(() => {
          alert('You have successfully submitted.');
          setContact('');
          setName('');
        })
        .catch((error) => console.log(e));
    }
  };
  return (
    <div className='flex flex-col items-center px-4 mx-auto py-14 max-w-7xl sm:px-6 lg:px-8'>
      <p className='mb-10 text-xl text-center sm:text-2xl sm:w-4/6 '>
        Subscribe to our newsletter to receive offers, latest news and updates.
      </p>
      <form
        id='notify'
        className='mt-4 sm:flex sm:max-w-md'
        onSubmit={_handleSubmit}
      >
        <div className='w-full sm:w-max'>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type='text'
            name='name'
            id='name'
            autoComplete='name'
            placeholder='Name'
            required
            className='block w-full mb-4 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-lg'
          />
          <input
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            type='text'
            name='contact'
            id='contact'
            autoComplete='contact'
            placeholder='Mobile phone or email'
            required
            className='block w-full mb-4 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-lg'
          />
          <button
            type='submit'
            className='w-full px-5 py-2 text-base text-white uppercase border border-transparent rounded-md shadow-sm bg-dark-green sm:text-xl hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600'
          >
            Notify Me
          </button>
        </div>
      </form>
    </div>
  );
}
