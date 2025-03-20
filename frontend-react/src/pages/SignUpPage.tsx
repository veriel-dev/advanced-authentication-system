import { motion } from 'framer-motion';
import Input from '../components/Input';
import { Mail, User, Lock, Loader } from 'lucide-react';
import useForm from '../hooks/useForm';
import { Link, useNavigate } from 'react-router-dom';
import PasswordStrength from '../components/PasswordStrength';
import { useAuthStore } from '../store/useAuthStore';

const SignUpPage = () => {
  const navigate = useNavigate();
  const initialState = {
    email: '',
    password: '',
    name: '',
  };
  const { formData, handleInputChange, handleSubmit } = useForm(initialState);
  const { signup, error, isLoading } = useAuthStore();

  const submitForm = async (data: typeof formData) => {
    try {
      await signup(data.email, data.password, data.name);
      navigate('/verify-email');
    } catch (error) {
      console.log(error);
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
          Create Account
        </h2>
        <form onSubmit={(e) => handleSubmit(e, submitForm)}>
          <Input
            icon={User}
            type="text"
            placeholder="Full Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <Input
            icon={Mail}
            type="email"
            placeholder="Email Address"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
          <Input
            icon={Lock}
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
          {/* Password Strength  meter*/}
          {error && <p className="text-red-500 text-sm mt-2 font-semibold">{error}</p>}
          <PasswordStrength password={formData.password} />

          <motion.button
            className="mt-6 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-lg
                shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? <Loader className="animate-spin mx-auto" size={24} /> : 'Sign Up'}
          </motion.button>
        </form>
      </div>
      <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
        <p className="text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-green-400 font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default SignUpPage;
