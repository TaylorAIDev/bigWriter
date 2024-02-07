// InputPage.js

import React, { useState } from 'react';
import './input.css'

function InputPage({ sections, loading, onSubmit }) {
  const [inputTopic, setinputTopic] = useState('');
  const [inputFormat, setinputFormat] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const message = {
      role:'user',
      content: `Write about ${inputTopic} in an ${inputFormat} format as the first part of long story.`
    }
    onSubmit(message);
  };

  const isButtonDisabled = inputTopic === '' || inputFormat === '';


  return (
    <form onSubmit={handleSubmit} className="m-auto flex items-center mt-10 text-white text-xl">
      <label className="text-xl mx-1">Write about </label>
      <input type="text" className='mx-1 rounded-md bg-black p-2 outline-none' value={inputTopic} onChange={(event) => setinputTopic(event.target.value)} />
      <label className="text-xl mx-1">in a/an </label>
      <input type="text" className='mx-1 rounded-md bg-black p-2 outline-none' value={inputFormat} onChange={(event) => setinputFormat(event.target.value)} />
      <label className="text-xl mx-1">format. </label>
      {sections[0].content==='' && <button type="submit"className='mx-5 bg-black text-white p-2 rounded-md disabled:opacity-50' disabled={isButtonDisabled}>Generate!</button>}
    </form>
  );
}

export default InputPage;
