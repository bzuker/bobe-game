import Layout from "../components/layout";
import { useState } from 'react';

function TextQuestion({ text, answer, onCorrect = () => null }) {
  const [response, setResponse] = useState('');
  const [error, setError] = useState(false);

  function handleClick(e) {
    if (response.toLowerCase() !== answer.toLowerCase()) {
      setError(true);
      return;
    }

    setError(false);
    onCorrect();
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="p-3 text-lg font-bold bg-yellow-400 md:text-4xl text-center">
        {text}
      </h2>


      <div className="flex flex-col items-center justify-center w-full my-4">
        <input
          className="shadow border border-gray-700 rounded w-full py-12 px-3 leading-tight focus:outline-none focus:shadow-outline text-center text-4xl"
          id="answer"
          type="text"
          placeholder="Click acá para escribir la respuesta"
          autoComplete="off"
          onChange={e => setResponse(e.currentTarget.value)}
          value={response}
          onKeyDown={e => e.key === "Enter" ? handleClick() : null}
        />

        {error && <h2 className="p-3 text-lg font-bold bg-red-400 md:text-4xl text-center my-4">
          Casi! Volvé a probar
        </h2>}

        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold text-5xl py-2 px-4 rounded my-4" onClick={handleClick}>
          Mandar
        </button>
      </div>
    </div>
  );
}

function MultipleChoiceQuestion({ text, options, answer, onCorrect = () => null }) {
  const [error, setError] = useState(false);

  function handleClick(e) {
    const clickedText = e.currentTarget.textContent;
    if (clickedText !== answer) {
      setError(true);
      return;
    }

    setError(false);
    onCorrect();
  }
  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="p-3 text-lg font-bold bg-yellow-400 md:text-4xl text-center">
        {text}
      </h2>

      {error && <h2 className="p-3 text-lg font-bold bg-red-400 md:text-4xl text-center my-4">
        Casi! Probá de nuevo
      </h2>}

      <div className="flex flex-col items-center justify-center w-full my-2">
        {options.map((x) => (
          <button key={x.text} className="bg-blue-500 text-white border hover:bg-blue-700 font-bold text-5xl py-2 px-4 rounded my-4"
          onClick={handleClick}>
            {x.text}
          </button>
        ))}
      </div>
    </div>
  );
}

function WelcomeMessage({ startGame }) {
  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <h2 className="p-3 text-lg font-bold bg-yellow-400 md:text-4xl">
          Hola! Vamos a contestar algunas preguntas
        </h2>
      </div>
      <div className="flex flex-col items-center justify-center my-20">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold text-4xl py-2 px-4 rounded"
          onClick={() => startGame()}
        >
          Empezar
        </button>
      </div>
    </>
  );
}

function Index() {
  const [questions, setQuestions] = useState([
    {
      text: "Cómo se llama tu nieto mayor?",
      type: "multiple-choice",
      options: [
        { text: "Brian" },
        { text: "Damián" },
        { text: "Julián" },
      ],
      answer: "Damián",
    },
    {
      text: "Completá la frase: Billetera mata...",
      type: "text",
      answer: "galan"
    }
  ]);
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  
  function startGame() {
    const index = Math.floor(Math.random() * questions.length);
    const question = questions[index];
    setStarted(true);
    setCurrentQuestion(question);
    setQuestions(questions.filter(x => x.text !== question.text))
  }

  function renderQuestion(question) {
    if (!question) {
      return;
    }

    if (question.type === 'multiple-choice') {
      return <MultipleChoiceQuestion {...question} />
    }

    if (question.type === 'text') {
      return <TextQuestion {...question} />;
    }
  }

  console.log({questions})
  return (
    <Layout>
      { !started && <WelcomeMessage startGame={startGame} /> }
      {renderQuestion(currentQuestion)}
    </Layout>
  );
}

export default Index;
