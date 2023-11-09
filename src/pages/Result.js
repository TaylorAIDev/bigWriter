// ResultPage.js

import React from 'react';
import "./spinner.css";

function ResultPage({ sections, result, loading, onSubmit}) {
  
  const sendPrompt = () => {
    const message = {
      role:'user',
      content: `Continue writing story`
    }
    onSubmit(message);
  };

  const saveToPdf = () => {
    fetch('http://localhost:5000/savePdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({data: sections})
    })
  }

  return (
    <div className='mb-4'>
      <div id='content' className='text-white mt-5 flex flex-col items-center border-1 border-orange-100'>
        {
          sections.map((section, index) =>
            (
              <div className='m-4 p-2 w-4/5 flex flex-col items-center' key={index}>
                <p className="">{section.content}</p>              
                <img className="w-2/5" src={section.imageurl} />
              </div>
            )
          )
        }
        {loading&&
          <div className="spinner-container">
            <div className="loading-spinner">
            </div>
          </div>
        }
      </div>
      {!loading&&
        <div className='flex flex-row items-center justify-around'>
          <button className='mt-5 text-white bg-black rounded-md w-32 text-md disabled:opacity-50' disabled={sections.length<2} onClick={sendPrompt}>Continue</button>
          <button className='mt-5 text-white bg-black rounded-md w-32 text-md disabled:opacity-50' disabled={sections.length<2} onClick={saveToPdf}>Download</button>
        </div>
      }
    </div>
  );
}

export default ResultPage;
