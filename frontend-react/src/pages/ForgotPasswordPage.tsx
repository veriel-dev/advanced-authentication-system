import { motion } from 'framer-motion';
import Input from '../components/Input';
import { Mail, Loader, ArrowLeft } from 'lucide-react';
import useForm from '../hooks/useForm';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useState } from 'react';

const ForgotPasswordPage = () => {
  const initialState = {
    email: '',
  };
  const { formData, handleInputChange, handleSubmit } = useForm(initialState);
  const { isLoading, error, forgotPassword } = useAuthStore();
  const [isSubmited, setIsSubmited] = useState(false);

  const submitForm = async (data: typeof formData) => {
    await forgotPassword(data.email);
    setIsSubmited(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Forgot Password
        </h2>
        {!isSubmited ? (
          <form onSubmit={(e) => handleSubmit(e, submitForm)}>
            <p className="text-gray-300 mb-6 text-center">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            <Input
              icon={Mail}
              type="email"
              placeholder="Email Address"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}
            <motion.button
              className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-lg
                  shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader className="w-6 h-6 animate-spin text-center mx-auto" />
              ) : (
                'Send Reset Link'
              )}
            </motion.button>
          </form>
        ) : (
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Mail className="h-8 w-8 text-white" />
            </motion.div>
            <p className="text-gray-300 mb-6">
              If an account for {formData.email}, you will receive a password reset link shortly.
            </p>
          </div>
        )}
      </div>
      <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
        <Link
          to="/login"
          className="text-green-400 font-bold hover:underline flex items-center justify-center gap-1"
        >
          <ArrowLeft className="h-5 w-5" /> Back to Login
        </Link>
      </div>
    </motion.div>
  );
};

export default ForgotPasswordPage;
