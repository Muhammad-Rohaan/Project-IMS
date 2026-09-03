import React from 'react';
import { useState } from 'react';
import { CpuChipIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { aiAPI } from '../../api/axios';

const GenerateQuiz = () => {

    const [topic, setTopic] = useState('');
    const [difficulty, setDifficulty] = useState('medium');
    const [count, setCount] = useState(5);
    const [loading, setLoading] = useState(false);
    const [quizData, setQuizData] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);

    const difficulties = ['easy', 'medium', 'hard'];
    const counts = [5, 10, 15, 20];

    const handleGenerateQuiz = async () => {

        if (!topic.trim()) {
            alert('Please enter a topic');
            return;
        }

        try {

            setLoading(true);

            const response = await aiAPI.post('/quizzes/generate', {
                topic,
                difficulty,
                count
            });

            const data = response.data;

            setQuizData(data);
            setCurrentQuestion(0);
            setSelectedAnswers({});
            setShowResults(false);
            setScore(0);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }
    };

    if (quizData && !showResults) {

        const currentQuiz = quizData.questions[currentQuestion];

        return (

            <div className="p-4 md:p-8 text-white">

                <div
                    className="max-w-4xl mx-auto
                bg-blue-950/50 border border-blue-400/20
                rounded-3xl p-6 md:p-10 shadow-2xl"
                >

                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">

                        <div>

                            <h1 className="text-3xl font-black text-blue-400">
                                {quizData.topic}
                            </h1>

                            <p className="text-gray-400 mt-2">
                                Question {currentQuestion + 1} of {quizData.questions.length}
                            </p>

                        </div>

                        <div
                            className="px-4 py-2 rounded-2xl
                        bg-sky-500/20 border border-sky-400/30
                        text-sky-300 font-bold capitalize"
                        >
                            {quizData.difficulty}
                        </div>

                    </div>

                    {/* Question Card */}
                    <div
                        className="bg-black/20 rounded-3xl
                    border border-blue-700 p-8"
                    >

                        <h2 className="text-2xl font-bold text-white leading-relaxed">
                            {currentQuiz.question}
                        </h2>

                        {/* Options */}
                        <div className="mt-8 space-y-4">

                            {currentQuiz.options.map((option, index) => {

                                const isSelected =
                                    selectedAnswers[currentQuestion] === index;

                                return (

                                    <button
                                        key={index}
                                        onClick={() =>
                                            setSelectedAnswers({
                                                ...selectedAnswers,
                                                [currentQuestion]: index
                                            })
                                        }
                                        className={`w-full text-left p-5 rounded-2xl
                                    border transition-all duration-300
                                    ${isSelected
                                                ? 'border-blue-400 bg-blue-500/20'
                                                : 'border-blue-700 bg-blue-900/30 hover:border-blue-400'
                                            }`}
                                    >

                                        <div className="flex items-center gap-4">

                                            <div
                                                className={`w-10 h-10 rounded-xl
                                            flex items-center justify-center
                                            font-black
                                            ${isSelected
                                                        ? 'bg-blue-400 text-black'
                                                        : 'bg-blue-950 text-blue-400'
                                                    }`}
                                            >
                                                {String.fromCharCode(65 + index)}
                                            </div>

                                            <span className="text-lg text-gray-200">
                                                {option}
                                            </span>

                                        </div>

                                    </button>

                                );
                            })}

                        </div>

                    </div>

                    {/* Buttons */}
                    <div className="flex justify-between mt-10">

                        <button
                            disabled={currentQuestion === 0}
                            onClick={() =>
                                setCurrentQuestion(currentQuestion - 1)
                            }
                            className="px-6 py-3 rounded-2xl
                        bg-blue-900/50 border border-blue-700
                        disabled:opacity-40"
                        >
                            Previous
                        </button>

                        {currentQuestion < quizData.questions.length - 1 ? (

                            <button
                                onClick={() =>
                                    setCurrentQuestion(currentQuestion + 1)
                                }
                                className="px-6 py-3 rounded-2xl
                            bg-gradient-to-r from-blue-500 to-sky-600
                            font-bold"
                            >
                                Next
                            </button>

                        ) : (

                            <button
                                onClick={async() => {

                                    let totalScore = 0;

                                    quizData.questions.forEach((q, index) => {

                                        if (
                                            selectedAnswers[index] === q.correctAnswer
                                        ) {
                                            totalScore++;
                                        }
                                    });

                                    setScore(totalScore);
                                    // ✅ Save result to MongoDB
                                    try {
                                        await aiAPI.post('/results', {
                                            quizId: quizData.quizId,
                                            score: totalScore,
                                            selectedAnswers: selectedAnswers
                                        });
                                    } catch (err) {
                                        console.error('Failed to save result:', err);
                                    }

                                    setShowResults(true);

                                }}
                                className="px-6 py-3 rounded-2xl
                            bg-gradient-to-r from-emerald-500 to-blue-500
                            font-black"
                            >
                                Submit Quiz
                            </button>

                        )}

                    </div>

                </div>

            </div>

        );
    }
    if (quizData && showResults) {
        return (
            <div className="p-6 text-white max-w-3xl mx-auto">

                <div className="bg-blue-950/50 border border-blue-400/20 rounded-3xl p-8 text-center">

                    <h1 className="text-3xl font-black text-blue-400 mb-4">
                        Quiz Results
                    </h1>

                    <p className="text-2xl text-white">
                        Score: {score} / {quizData.questions.length}
                    </p>

                    <ul className="mt-6 text-left space-y-4">
                        {quizData.questions.map((q, i) => (
                            <li key={i} className="bg-black/20 p-4 rounded-xl">

                                <p className="font-bold text-white">
                                    Q{i + 1}: {q.question}
                                </p>

                                <p className="text-green-400 mt-2">
                                    Correct Answer: {q.options[q.correctAnswer]}
                                </p>

                                <p className="text-red-400">
                                    Your Answer: {q.options[selectedAnswers[i]] ?? "Not Answered"}
                                </p>

                            </li>
                        ))}
                    </ul>
                    <p className="mt-4 text-gray-400">
                        {score === quizData.questions.length
                            ? "Perfect! Excellent work 🔥"
                            : score >= quizData.questions.length / 2
                                ? "Good job 👍"
                                : "Keep practicing 📚"}
                    </p>

                    <button
                        onClick={() => {
                            setQuizData(null);
                            setShowResults(false);
                            setCurrentQuestion(0);
                            setSelectedAnswers({});
                            setScore(0);
                        }}
                        className="mt-6 px-6 py-3 bg-blue-500 rounded-2xl font-bold"
                    >
                        Try Another Quiz
                    </button>

                </div>

            </div>
        );
    }
    return (
        <div className="p-4 md:p-8 text-white">

            {/* HERO SECTION */}
            <div
                className="relative overflow-hidden
                bg-gradient-to-br from-blue-950/70
                via-blue-900/60 to-sky-950/70
                border border-blue-400/20
                rounded-3xl p-6 md:p-10
                shadow-2xl backdrop-blur-md"
            >

                {/* Glow Effects */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 blur-3xl rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-sky-500/10 blur-3xl rounded-full"></div>

                <div className="relative z-10">

                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">

                        <div
                            className="p-4 rounded-2xl
                            bg-blue-500/10
                            border border-blue-400/30"
                        >
                            <CpuChipIcon className="w-10 h-10 text-blue-400" />
                        </div>

                        <div>
                            <h1
                                className="text-3xl md:text-3xl font-black
                                bg-gradient-to-r from-blue-400
                                via-blue-400 to-sky-500
                                bg-clip-text text-transparent"
                            >
                                AI MCQs Generator
                            </h1>

                            <p className="text-gray-400 mt-2 text-sm md:text-base">
                                Generate intelligent quizzes instantly using AI
                            </p>
                        </div>

                    </div>

                    {/* MAIN GRID */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* FORM SECTION */}
                        <div
                            className="lg:col-span-2
                            bg-blue-900/40
                            border border-blue-400/20
                            rounded-3xl p-6 md:p-8"
                        >

                            {/* Topic */}
                            <div className="mb-8">

                                <label
                                    className="block text-sm font-bold
                                    text-blue-400 uppercase
                                    tracking-widest mb-3"
                                >
                                    Quiz Topic
                                </label>

                                <input
                                    type="text"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="Enter any topic..."
                                    className="w-full bg-black/30
                                    border border-blue-700
                                    rounded-2xl px-5 py-4
                                    outline-none focus:border-blue-400
                                    text-white"
                                />

                            </div>

                            {/* Difficulty */}
                            <div className="mb-8">

                                <label
                                    className="block text-sm font-bold
                                    text-sky-400 uppercase
                                    tracking-widest mb-3"
                                >
                                    Difficulty
                                </label>

                                <div className="flex flex-wrap gap-4">

                                    {difficulties.map((level) => (

                                        <button
                                            key={level}
                                            onClick={() => setDifficulty(level)}
                                            className={`px-6 py-3 rounded-2xl
                                            font-bold capitalize
                                            transition-all duration-300
                                            ${difficulty === level
                                                    ? 'bg-gradient-to-r from-blue-500 to-sky-600 text-white shadow-lg'
                                                    : 'bg-blue-900/50 border border-blue-700 text-gray-300 hover:border-blue-400'
                                                }`}
                                        >
                                            {level}
                                        </button>

                                    ))}

                                </div>

                            </div>

                            {/* Question Count */}
                            <div className="mb-10">

                                <label
                                    className="block text-sm font-bold
                                    text-emerald-400 uppercase
                                    tracking-widest mb-3"
                                >
                                    Number of Questions
                                </label>

                                <div className="flex flex-wrap gap-4">

                                    {counts.map((num) => (

                                        <button
                                            key={num}
                                            onClick={() => setCount(num)}
                                            className={`w-16 h-16 rounded-2xl
                                            font-black text-lg
                                            transition-all duration-300
                                            ${count === num
                                                    ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg'
                                                    : 'bg-blue-900/50 border border-blue-700 text-gray-300 hover:border-emerald-400'
                                                }`}
                                        >
                                            {num}
                                        </button>

                                    ))}

                                </div>

                            </div>

                            {/* Generate Button */}
                            <button
                                onClick={handleGenerateQuiz}
                                disabled={loading}
                                className="w-full
                                bg-gradient-to-r from-blue-500
                                via-blue-500 to-sky-600
                                hover:scale-[1.02]
                                transition-transform duration-300
                                py-5 rounded-2xl
                                text-lg font-black
                                shadow-2xl
                                flex items-center justify-center gap-3"
                            >

                                {loading ? (
                                    <>
                                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <SparklesIcon className="w-6 h-6" />
                                        Generate AI Quiz
                                    </>
                                )}

                            </button>

                        </div>

                        {/* INFO CARD */}
                        <div
                            className="bg-blue-900/40
                            border border-sky-400/20
                            rounded-3xl p-6 md:p-8"
                        >

                            <h3 className="text-2xl font-black text-sky-400 mb-6">
                                Smart Learning
                            </h3>

                            <div className="space-y-5">

                                <div
                                    className="bg-black/20 rounded-2xl
                                    p-4 border border-blue-400/10"
                                >
                                    <h4 className="text-blue-400 font-bold mb-2">
                                        AI Powered
                                    </h4>

                                    <p className="text-gray-400 text-sm">
                                        Dynamic quiz generation using artificial intelligence.
                                    </p>
                                </div>

                                <div
                                    className="bg-black/20 rounded-2xl
                                    p-4 border border-emerald-400/10"
                                >
                                    <h4 className="text-emerald-400 font-bold mb-2">
                                        Instant Results
                                    </h4>

                                    <p className="text-gray-400 text-sm">
                                        Get immediate feedback and explanations.
                                    </p>
                                </div>

                                <div
                                    className="bg-black/20 rounded-2xl
                                    p-4 border border-sky-400/10"
                                >
                                    <h4 className="text-sky-400 font-bold mb-2">
                                        Exam Practice
                                    </h4>

                                    <p className="text-gray-400 text-sm">
                                        Improve concepts and prepare smarter.
                                    </p>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default GenerateQuiz;