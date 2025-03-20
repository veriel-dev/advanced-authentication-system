import { ChangeEvent, FormEvent, useState } from 'react';

interface FormState {
  [key: string]: string;
}
const useForm = (initialState: FormState) => {
  const [formData, setFormData] = useState<FormState>(initialState);
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prevState) => ({
        ...prevState,
        [name]: checked.toString(),
      }));
      return;
    }

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleSubmit = (e: FormEvent<HTMLFormElement>, onSubmit: (data: FormState) => void) => {
    e.preventDefault();
    onSubmit(formData);
  };
  const resetForm = () => {
    setFormData(initialState);
  };
  return {
    formData,
    handleInputChange,
    handleSubmit,
    resetForm,
    setFormData,
  };
};

export default useForm;
