import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

interface Question {
  text: string;
  options: string[];
  correctOptionIndex: number;
}

interface QuizFormData {
  title: string;
  description: string;
  category: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  questions: Question[];
}

const CreateQuiz = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<QuizFormData>({
    title: '',
    description: '',
    category: '',
    difficulty: 'MEDIUM',
    questions: [
      {
        text: '',
        options: ['', '', '', ''],
        correctOptionIndex: 0,
      },
    ],
  });

  const createQuizMutation = useMutation({
    mutationFn: async (quizData: QuizFormData) => {
      const response = await axios.post(
        'http://localhost:8080/api/quizzes',
        quizData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      toast.success('Quiz créé avec succès !');
      navigate('/quizzes');
    },
    onError: () => {
      toast.error('Erreur lors de la création du quiz');
    },
  });

  const handleQuestionChange = (index: number, field: keyof Question, value: any) => {
    const newQuestions = [...formData.questions];
    if (field === 'options') {
      newQuestions[index] = {
        ...newQuestions[index],
        options: value,
      };
    } else {
      newQuestions[index] = {
        ...newQuestions[index],
        [field]: value,
      };
    }
    setFormData({ ...formData, questions: newQuestions });
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          text: '',
          options: ['', '', '', ''],
          correctOptionIndex: 0,
        },
      ],
    });
  };

  const removeQuestion = (index: number) => {
    const newQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createQuizMutation.mutate(formData);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Créer un nouveau quiz</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Titre
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input mt-1"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input mt-1"
                rows={3}
                required
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Catégorie
              </label>
              <input
                type="text"
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="input mt-1"
                required
              />
            </div>

            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
                Difficulté
              </label>
              <select
                id="difficulty"
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as 'EASY' | 'MEDIUM' | 'HARD' })}
                className="input mt-1"
              >
                <option value="EASY">Facile</option>
                <option value="MEDIUM">Moyen</option>
                <option value="HARD">Difficile</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {formData.questions.map((question, questionIndex) => (
            <div key={questionIndex} className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Question {questionIndex + 1}</h3>
                {formData.questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(questionIndex)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Supprimer
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Question
                  </label>
                  <input
                    type="text"
                    value={question.text}
                    onChange={(e) => handleQuestionChange(questionIndex, 'text', e.target.value)}
                    className="input mt-1"
                    required
                  />
                </div>

                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center space-x-4">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...question.options];
                        newOptions[optionIndex] = e.target.value;
                        handleQuestionChange(questionIndex, 'options', newOptions);
                      }}
                      className="input flex-1"
                      placeholder={`Option ${optionIndex + 1}`}
                      required
                    />
                    <input
                      type="radio"
                      name={`correct-${questionIndex}`}
                      checked={question.correctOptionIndex === optionIndex}
                      onChange={() => handleQuestionChange(questionIndex, 'correctOptionIndex', optionIndex)}
                      className="h-4 w-4 text-primary-600"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newOptions = question.options.filter((_, i) => i !== optionIndex);
                        handleQuestionChange(questionIndex, 'options', newOptions);
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      Supprimer
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    const newOptions = [...question.options, ''];
                    handleQuestionChange(questionIndex, 'options', newOptions);
                  }}
                  className="btn btn-secondary"
                >
                  Ajouter une option
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addQuestion}
            className="btn btn-secondary w-full"
          >
            Ajouter une question
          </button>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/quizzes')}
            className="btn btn-secondary"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={createQuizMutation.isPending}
          >
            {createQuizMutation.isPending ? 'Création en cours...' : 'Créer le quiz'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateQuiz; 