import Layout from "../components/layout";
import { useState } from 'react';
import { getQuestions } from "../lib/getQuestions";

function TextQuestion({ text, answer, image, onCorrect = () => null }) {
  const [response, setResponse] = useState('');
  const [error, setError] = useState(false);

  function handleClick() {
    const parsedResponse = response.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const parsedAnswer = answer.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (parsedResponse.toLowerCase() !== parsedAnswer.toLowerCase()) {
      setError(true);
      return;
    }

    setError(false);
    setResponse('');
    onCorrect();
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="p-3 text-lg font-bold bg-yellow-400 md:text-5xl text-center">
        {text}
      </h2>

      {image && <img src={image} className="max-w-md h-64"/>}

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

function MultipleChoiceQuestion({ text, options, answer, image, onCorrect = () => null }) {
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
      <h2 className="p-3 text-lg font-bold bg-yellow-400 md:text-5xl text-center">
        {text}
      </h2>

      {image && <img src={image} className="max-w-md h-64"/>}

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

function Message({ text, onClick, buttonText = "Empezar" }) {
  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <h2 className="p-3 text-lg font-bold bg-yellow-400 md:text-5xl text-center">
          {text}
        </h2>
      </div>
      <div className="flex flex-col items-center justify-center my-20">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold text-4xl py-2 px-4 rounded"
          onClick={() => onClick()}
        >
          {buttonText}
        </button>
      </div>
    </>
  );
}

function renderQuestion(question, onCorrect, startGame) {
  if (!question) {
    return <Message text="Se acabaron las preguntas!" buttonText="Volver a jugar" onClick={startGame} />
  }

  if (question.type === 'multiple-choice') {
    return <MultipleChoiceQuestion {...question} onCorrect={onCorrect} />
  }

  if (question.type === 'text') {
    return <TextQuestion {...question} onCorrect={onCorrect} />;
  }
}

// Gets a random question
function getNextQuestion(questions) {
  const index = Math.floor(Math.random() * questions.length);
  return questions[index];
}

function Index({ questions: remoteQuestions }) {
  const [questions, setQuestions] = useState(remoteQuestions);
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  
  function startGame() {
    const question = getNextQuestion(remoteQuestions);
    setStarted(true);
    setCurrentQuestion(question);
    setQuestions(remoteQuestions.filter(x => x.text !== question.text));
  }

  function onCorrectGuess() {
    const question = getNextQuestion(questions);
    setCurrentQuestion(question);
    setQuestions(questions.filter(x => x.text !== question.text));
  }

  return (
    <Layout>
      { !started && <Message text="Hola! Vamos a contestar algunas preguntas" onClick={startGame} /> }
      {started && renderQuestion(currentQuestion, onCorrectGuess, startGame)}
    </Layout>
  );
}

export async function getStaticProps(context) {
  const questions = await getQuestions();
  return {
    props: {
      questions
    },
    revalidate: 5
  }
}

export default Index;
