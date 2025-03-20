
import { motion } from 'framer-motion';
import Input from '../components/Input';
import {  ArrowLeft, Lock } from 'lucide-react';
import useForm from '../hooks/useForm';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

const ResetPasswordPage = () => {
  const initialState = {
    password: '',
    confirmPassword: '',
  };
  const { formData, handleInputChange, handleSubmit } = useForm(initialState);
  const { isLoading, error, resetPassword, message } = useAuthStore();
  const { token } = useParams();
  const navigate = useNavigate()
  const submitForm = async (data: typeof formData) => {
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await resetPassword(token as string, data.password);
      toast.success('Password reset successfully, redirecting to login');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error('Error resetting password');
    }
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
          Reset Password
        </h2>
        {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}
        {message && <p className="text-green-500 font-semibold mt-2">{message}</p>}
        <form onSubmit={(e) => handleSubmit(e, submitForm)}>
          <Input
            icon={Lock}
            type="password"
            placeholder="New Password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <Input
            icon={Lock}
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
          />
          <motion.button
            className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-lg
              shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Resseting...' : 'Send New Password'}
          </motion.button>
        </form>
      </div>
      <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
        <Link to="/login" className="text-green-400 font-bold hover:underline flex items-center justify-center gap-1">
          <ArrowLeft className='h-5 w-5' /> Back to Login
        </Link>
      </div>
    </motion.div>
  );
};

export default ResetPasswordPage;
