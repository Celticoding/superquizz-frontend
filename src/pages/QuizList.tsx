import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

interface Quiz {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  questionCount: number;
  author: {
    id: number;
    username: string;
  };
}

const QuizList = () => {
  const { token } = useAuth();

  const { data: quizzes, isLoading } = useQuery<Quiz[]>({
    queryKey: ['quizzes'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:8080/api/quizzes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Quiz disponibles</h1>
        <Link to="/quizzes/create" className="btn btn-primary">
          Créer un quiz
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {quizzes?.map((quiz) => (
          <div key={quiz.id} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">{quiz.title}</h3>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  quiz.difficulty === 'EASY' ? 'bg-green-100 text-green-800' :
                  quiz.difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {quiz.difficulty}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-500">{quiz.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">
                    {quiz.questionCount} questions
                  </span>
                  <span className="text-sm text-gray-500">
                    Par {quiz.author.username}
                  </span>
                </div>
                <Link
                  to={`/quizzes/${quiz.id}`}
                  className="btn btn-primary"
                >
                  Commencer
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizList; 