"use client";

import React, { useState } from 'react';
import { Eye, EyeOff, Facebook, FacebookIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button, Checkbox, Input } from '@nextui-org/react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useAuth } from '@/contexts/AuthContext';

const LoginForm = () => {
  const router = useRouter();
  const { login, googleLogin, isLoading } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: '', password: '' },
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
    } catch (error) {
      toast.error('Google đăng nhập thất bại. Vui lòng thử lại.');
    }
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
      console.error('Login error in form:', error);
      
      // Provide more specific error messages to the user
      let errorMessage = 'Đăng nhập thất bại. Vui lòng thử lại.';
      
      if (error?.message) {
        if (error.message.includes('Invalid email or password')) {
          errorMessage = 'Email hoặc mật khẩu không đúng.';
        } else if (error.message.includes('Login endpoint not found')) {
          errorMessage = 'Lỗi cấu hình API. Vui lòng liên hệ quản trị viên.';
        } else if (error.message.includes('Network error')) {
          errorMessage = 'Lỗi kết nối. Vui lòng kiểm tra internet và thử lại.';
        } else if (error.message.includes('Server error')) {
          errorMessage = 'Lỗi máy chủ. Vui lòng thử lại sau.';
        } else if (error.message.includes('timeout')) {
          errorMessage = 'Hết thời gian chờ. Vui lòng thử lại.';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error(errorMessage);
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
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
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

export default LoginForm;
