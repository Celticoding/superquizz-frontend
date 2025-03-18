import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

interface Question {
  id: number;
  text: string;
  options: string[];
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  questions: Question[];
  author: {
    id: number;
    username: string;
  };
}

interface Answer {
  questionId: number;
  selectedOptionIndex: number;
}

const QuizDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showResults, setShowResults] = useState(false);

  const { data: quiz, isLoading } = useQuery<Quiz>({
    queryKey: ['quiz', id],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:8080/api/quizzes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    },
  });

  const submitQuizMutation = useMutation({
    mutationFn: async (answers: Answer[]) => {
      const response = await axios.post(
        `http://localhost:8080/api/quizzes/${id}/submit`,
        { answers },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Quiz terminé !');
      navigate('/dashboard');
    },
    onError: () => {
      toast.error('Erreur lors de la soumission du quiz');
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!quiz) {
    return <div>Quiz non trouvé</div>;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...answers];
    const existingAnswerIndex = newAnswers.findIndex(
      (a) => a.questionId === currentQuestion.id
    );

    if (existingAnswerIndex >= 0) {
      newAnswers[existingAnswerIndex] = {
        questionId: currentQuestion.id,
        selectedOptionIndex: optionIndex,
      };
    } else {
      newAnswers.push({
        questionId: currentQuestion.id,
        selectedOptionIndex: optionIndex,
      });
    }
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    if (answers.length !== quiz.questions.length) {
      toast.error('Veuillez répondre à toutes les questions');
      return;
    }
    submitQuizMutation.mutate(answers);
  };

  if (showResults) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Récapitulatif</h2>
          <p className="text-gray-600 mb-6">
            Vous avez répondu à {answers.length} questions sur {quiz.questions.length}
          </p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setShowResults(false)}
              className="btn btn-secondary"
            >
              Revoir les réponses
            </button>
            <button
              onClick={handleSubmit}
              className="btn btn-primary"
              disabled={submitQuizMutation.isPending}
            >
              {submitQuizMutation.isPending ? 'Soumission en cours...' : 'Soumettre le quiz'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
          <p className="text-gray-600 mt-2">{quiz.description}</p>
          <div className="mt-4 flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              Question {currentQuestionIndex + 1} sur {quiz.questions.length}
            </span>
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              quiz.difficulty === 'EASY' ? 'bg-green-100 text-green-800' :
              quiz.difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {quiz.difficulty}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {currentQuestion.text}
            </h3>
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <label
                  key={index}
                  className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name="answer"
                    checked={
                      answers.find((a) => a.questionId === currentQuestion.id)
                        ?.selectedOptionIndex === index
                    }
                    onChange={() => handleAnswerSelect(index)}
                    className="h-4 w-4 text-primary-600"
                  />
                  <span className="ml-3 text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="btn btn-secondary"
            >
              Précédent
            </button>
            <button
              onClick={handleNext}
              className="btn btn-primary"
            >
              {currentQuestionIndex === quiz.questions.length - 1 ? 'Terminer' : 'Suivant'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizDetail; 