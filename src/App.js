import { useState } from 'react';
import './App.css';
import InputPage from './pages/Input';
import ResultPage from './pages/Result';

function App() {

  const [result, setResult] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'You are a helpful assistant'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState([{
    content: '',
    imageurl: ''
  }]);
  const [started, SetStarted] = useState(false);

  //Get story and image from the prompt
  const handleSubmit = async (message) => {
    SetStarted(true);
    
    //start loading
    setLoading(true)

    //push sending message into messages state
    setMessages(prev => [...prev, message])
    
    const sendingMessages = [messages[messages.length-1], message]
    const receivedMessage = {
      role: 'assistant',
      content: ''
    }

    // get content from openai chatgpt by streaming and save into state
    const response = await fetch('http://localhost:5000/write', {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({data: sendingMessages}),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while(true) {
      const {value, done} = await reader.read();
      const decodedChunk = decoder.decode(value);
      if(done) {
        break;
      }

      receivedMessage.content += decodedChunk;

      //set state with streaming content
      const temp = [...sections];
      temp[temp.length-1].content += decodedChunk;
      setSections(temp);
    }

    //push received message into messages state
    setMessages(prev => [...prev, receivedMessage])

    // get image url from midjourney
    const responseimage = await fetch('http://localhost:5000/getImage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({data: receivedMessage.content})
    })

    // //set state with imageurl
    const responseimageJson = await responseimage.json();
    let imageUrl = ''
    if(responseimageJson['status'] == "success"){
      imageUrl = responseimageJson['message']
    } else {
      imageUrl = '';
    }
    const temp = [...sections];
    temp[temp.length-1].imageurl = imageUrl;
    setSections(temp);
    setSections(prev=>[...prev, {content: '', imageurl: ''}]);

    //stop loading
    setLoading(false);
  };
  return (
    <div className='flex flex-col max-w-screen-2xl m-auto'>
      <InputPage sections={sections} loading={loading} onSubmit={handleSubmit}/>
      <ResultPage sections={sections} result={result} loading={loading} onSubmit={handleSubmit}/>
    </div>
  );
}

export default App;