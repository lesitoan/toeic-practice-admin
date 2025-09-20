"use client";

import React, { useState } from 'react';
import { Eye, EyeOff, Facebook, FacebookIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button, Checkbox, Input } from '@nextui-org/react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useAuth } from '@/contexts/AuthContext';

const SignupForm = () => {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: '', password: '' },
  });
  const [showPassword, setShowPassword] = useState(false);

  // Hàm test để nhập đại email và password luôn đúng
  const handleTestLogin = () => {
    const testData = {
      email: 'admin@toeic.com',
      password: 'admin123'
    };
    
    // Tự động điền form với dữ liệu test
    const emailInput = document.querySelector('input[name="email"]');
    const passwordInput = document.querySelector('input[name="password"]');
    
    if (emailInput && passwordInput) {
      emailInput.value = testData.email;
      passwordInput.value = testData.password;
      
      // Trigger change events để form validation hoạt động
      emailInput.dispatchEvent(new Event('input', { bubbles: true }));
      passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    // Tự động submit form
    setTimeout(() => {
      handleLogin(testData);
    }, 100);
  };

  const handleLogin = async (data) => {
    console.log('Login data:', data);
    
    try {
      await login({
        email: data.email,
        password: data.password,
      });
      toast.success('Đăng nhập thành công!');
      router.push('/dashboard');
    } catch (error) {
      console.log('Login error:', error);
      toast.error('Đăng nhập thất bại. Vui lòng thử lại.');
    }
  };

      
  console.log(errors);

  return (
    <div className="bg-bgSecondary p-4 lg:p-6 flex flex-col justify-center min-w-[400px]">
      <div className="w-full max-w-md mx-auto">
        {/* Form Header */}
        <div className="mb-8">
          <h2 className="text-h2" size={24}>Đăng nhập</h2>
          <p className="text-gray-400 text-sm">
            Chưa có tài khoản?
            <button
              className="text-blue-400 hover:text-blue-300 ml-1 transition-colors duration-200"
              onClick={() => router.push('/sign-up')}
            >
              Đăng kí
            </button>
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit(handleLogin)}>
          {/* Email Input */}
          <div>
            <Input
              name="email"
              placeholder="Nhập email"
              type="email"
              color="primary"
              classNames={{
                base: 'h-12',
                input: `text-sm ${errors.email && '!text-red-500 !placeholder-red-500'}`,
                inputWrapper: `!h-[48px] !rounded-lg !outline-none ${errors.email && '!border-2 !border-solid !border-red-500 bg-red-100'}`,
              }}
              {...register('email', {
                required: 'Email là bắt buộc',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Email không hợp lệ',
                },
              })}
            />
            <p className="text-red-500 text-sm mt-2">{errors.email?.message}</p>
          </div>

          {/* Password Input */}
          <div>
            <div className="relative">
              <Input
                name="password"
                placeholder="Nhập mật khẩu"
                type={showPassword ? 'text' : 'password'}
                color="primary"
                classNames={{
                  base: 'h-12',
                  input: `text-sm ${errors.password && '!text-red-500 !placeholder-red-500'}`,
                  inputWrapper: `!h-[48px] !rounded-lg !outline-none  ${errors.password && '!border-2 !border-solid !border-red-500 bg-red-100'}`,
                }}
                {...register('password', {
                  required: 'Mật khẩu là bắt buộc',
                  // minLength: {
                  //   value: 6,
                  //   message: 'Mật khẩu phải có ít nhất 6 ký tự',
                  // },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover transition-colors duration-200"
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
            <p className="text-red-500 text-sm mt-2">{errors.password?.message}</p>
          </div>

          {/* Submit Button */}
          <Button
            color="primary"
            className="w-full rounded-lg h-12 shadow-md cursor-pointer bg-blue-600"
            type="submit"
            disabled={isLoading}
          >
            {!isLoading ? 'Đăng nhập' : 'Đang đăng nhập...'}
          </Button>

          
          
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"></div>
          <div className="relative flex justify-center text-sm items-center">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="px-2">Đăng nhập bằng</span>
            <div className="flex-grow border-t border-gray-600"></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Button
            color="default"
            className="w-full rounded-lg h-12 shadow-md cursor-pointer bg-orange-400"
            type="submit"
          >
            Google
          </Button>

          <Button
            color="primary"
            className="w-full rounded-lg h-12 shadow-md cursor-pointer bg-blue-600"
            type="submit"
          >
            <FacebookIcon size={20} />
            Facebook
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
