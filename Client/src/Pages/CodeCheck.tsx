import { useState } from 'react';
import type z from 'zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import codeSchema from '../Schema/checkCode';
import { useCheckMutation } from '../Slice/API/tableApi';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { setTableInfo } from '../Slice/auth';

type LoginForm = z.infer<typeof codeSchema>;

const CodeCheck = () => {
  const dispatch = useDispatch()
  const navigate= useNavigate()
  const [checkCode, { isLoading, error }] = useCheckMutation();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<LoginForm>({
    resolver: zodResolver(codeSchema),
    defaultValues: {
     
    }
  });

  const [apiError, setApiError] = useState<string>('');

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    try {
        setApiError('');
        
        const result = await checkCode({
            code: data.code  // Make sure this matches what backend expects
        }).unwrap();
        
        dispatch(setTableInfo(result))
        toast.success('Welcome! You can now browse our menu.', {
            onClose: () => {
                navigate('/home/main')
            }
        });
        
    } catch (err: any) {
        console.error('❌ Invalid table code:', err);
        const errorMessage = err?.data?.message || 'Invalid table code. Please check with staff.';
        setApiError(errorMessage);
        toast.error(errorMessage);
        reset();
    }
};

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg">
          {/* Restaurant Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11h6" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome!</h1>
            <p className="text-gray-600 text-lg mb-2">Enter your table code to start ordering</p>
            <p className="text-sm text-gray-500">Ask your server if you need help</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Table Code Input */}
            <div>
              <label htmlFor="tableCode" className="block text-lg font-semibold text-gray-700 mb-4 text-center">
                Table Code
              </label>
              <div className="relative">
                <input
                  id="tableCode"
                  type="number"
                  {...register('code', { 
                    valueAsNumber: true
                  })}
                  placeholder="000000"
                  className="w-full px-6 py-4 text-2xl text-center border-3 border-gray-200 rounded-2xl focus:outline-none focus:border-orange-500 focus:ring-6 focus:ring-orange-100 transition-all duration-200 font-bold tracking-wider [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
              </div>
              {errors.code && (
                <div className="mt-3 flex items-center justify-center text-red-600 text-base">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.code.message}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 px-6 rounded-2xl font-bold text-xl text-white transition-all duration-200 transform ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </div>
              ) : (
                'Start Ordering'
              )}
            </button>

            
            
          </form>
        </div>
      </div>
    </>
  );
};

export default CodeCheck;