import { useEffect, useRef, useState } from 'react';
import { Eye, EyeOff, Facebook, LucideYoutube, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button, Checkbox, Input, Select, SelectItem } from '@nextui-org/react';
import { set, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useAuth } from '@/contexts/AuthContext';
// import CradleLoader from '@/components/common/Loading/CradleLoader';

const SignUpForm = () => {
  const router = useRouter();
  const { register: registerUser, googleLogin } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const timeoutRef = useRef(null);

  const password = watch('password');
  const agreeToTerms = watch('agreeToTerms');

  // Gender options
  const genderOptions = [
    { key: 1, label: 'Nam' },
    { key: 2, label: 'Nữ' },
    { key: 3, label: 'Khác' }
  ];

  // Handle avatar upload
  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
        setValue('avatar', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
    } catch (error) {
      toast.error('Google đăng nhập thất bại. Vui lòng thử lại.');
    }
  };

  const handleRegister = async (data) => {
    setLoading(true);
    try {
      await registerUser({
        role_id: data.role_id || 1,
        name: data.name,
        email: data.email,
        gender: data.gender || 3,
        age: data.age,
        avatar: data.avatar || "",
        password: data.password,
        extra_fields: null
      });
      toast.success('Đăng ký tài khoản thành công!');
      timeoutRef.current = setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.response?.status === 400) {
        // Handle 400 errors (like "Email is already registered")
        const errorMessage = error.response.data?.errors || error.response.data?.message || 'Registration failed';
        if (errorMessage.includes('already registered')) {
          toast.error('Email đã được sử dụng. Vui lòng thử email khác hoặc đăng nhập.');
        } else {
          toast.error(errorMessage);
        }
      } else if (error.response?.status === 422) {
        // Handle validation errors
        const validationErrors = error.response.data.detail;
        if (Array.isArray(validationErrors)) {
          validationErrors.forEach(err => {
            toast.error(`${err.loc.join('.')}: ${err.msg}`);
          });
        } else {
          toast.error('Validation error: Please check your input');
        }
      } else {
        toast.error('Đăng ký thất bại. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="bg-bgSecondary p-4 lg:p-6 flex flex-col justify-center min-w-[400px]">
      <div className="w-full max-w-md mx-auto">
        {/* Form Header */}
        <div className="mb-8">
          <h2 className="text-h2">Tạo tài khoản</h2>
          <p className="text-gray-400 text-sm">
            Đã có tài khoản?
            <button
              className="text-blue-400 hover:text-blue-300 ml-1 transition-colors duration-200"
              onClick={() => router.push('/login')}
            >
              Đăng nhập
            </button>
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit(handleRegister)}>
          {/* Name Input */}
          <div>
            <Input
              name="name"
              placeholder="Nhập tên"
              type="text"
              color="primary"
              classNames={{
                base: 'h-12',
                input: `text-sm ${errors.name ? '!text-red-500 !placeholder-red-500' : ''}`,
                inputWrapper: `!h-[300px] !rounded-lg ${errors.name && '!border-2 !border-solid !border-red-500 bg-red-100'}`,
              }}
              {...register('name', { required: 'Tên là bắt buộc' })}
            />
            <p className="text-red-500 text-sm mt-2">{errors.name?.message}</p>
          </div>

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
                inputWrapper: `!h-[300px] !rounded-lg ${errors.email && '!border-2 !border-solid !border-red-500 bg-red-100'}`,
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

          {/* Gender Select */}
          <div>
            <Select
              name="gender"
              placeholder="Chọn giới tính"
              color="primary"
              classNames={{
                base: 'h-12',
                trigger: `!h-[48px] !rounded-lg ${errors.gender && '!border-2 !border-solid !border-red-500 bg-red-100'}`,
              }}
              {...register('gender', { required: 'Giới tính là bắt buộc' })}
            >
              {genderOptions.map((option) => (
                <SelectItem key={option.key} value={option.key}>
                  {option.label}
                </SelectItem>
              ))}
            </Select>
            <p className="text-red-500 text-sm mt-2">{errors.gender?.message}</p>
          </div>

          {/* Age Input */}
          <div>
            <Input
              name="age"
              placeholder="Ngày sinh"
              type="date"
              color="primary"
              classNames={{
                base: 'h-12',
                input: `text-sm ${errors.age && '!text-red-500 !placeholder-red-500'}`,
                inputWrapper: `!h-[300px] !rounded-lg ${errors.age && '!border-2 !border-solid !border-red-500 bg-red-100'}`,
              }}
              {...register('age', { required: 'Ngày sinh là bắt buộc' })}
            />
            <p className="text-red-500 text-sm mt-2">{errors.age?.message}</p>
          </div>

          {/* Avatar Upload */}
          <div>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
                ) : (
                  <Upload size={24} className="text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  id="avatar-upload"
                />
                <Button
                  as="label"
                  htmlFor="avatar-upload"
                  color="default"
                  variant="bordered"
                  className="w-full rounded-lg h-12"
                >
                  Tải lên ảnh đại diện
                </Button>
              </div>
            </div>
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
                  inputWrapper: `!h-[300px] !rounded-lg ${errors.password && '!border-2 !border-solid !border-red-500 bg-red-100'}`,
                }}
                {...register('password', {
                  required: 'Mật khẩu là bắt buộc',
                  minLength: {
                    value: 6,
                    message: 'Mật khẩu phải có ít nhất 6 ký tự',
                  },
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

          {/* Confirm Password Input */}
          <div>
            <div className="relative">
              <Input
                name="confirmPassword"
                placeholder="Xác nhận mật khẩu"
                type={showConfirmPassword ? 'text' : 'password'}
                color="primary"
                classNames={{
                  base: 'h-12',
                  input: `text-sm ${errors.confirmPassword && '!text-red-500 !placeholder-red-500'}`,
                  inputWrapper: `!h-[300px] !rounded-lg ${errors.confirmPassword && '!border-2 !border-solid !border-red-500 bg-red-100'}`,
                }}
                {...register('confirmPassword', {
                  required: 'Xác nhận mật khẩu là bắt buộc',
                  validate: (value) => value === password || 'Mật khẩu không khớp',
                })}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover transition-colors duration-200"
              >
                {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
            <p className="text-red-500 text-sm mt-2">{errors.confirmPassword?.message}</p>
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start space-x-3">
            <Checkbox
              name="agreeToTerms"
              id="terms"
              checked={agreeToTerms || false}
              className=""
              {...register('agreeToTerms', { required: true })}
            />
            <label
              htmlFor="terms"
              className={`text-sm ${errors.agreeToTerms ? 'text-red-500' : 'text-gray-500'}`}
            >
              Đồng ý với tất cả các điều khoản
            </label>
          </div>

          {/* Submit Button */}
          <Button
            color="primary"
            className={`w-full rounded-lg h-12 shadow-md ${agreeToTerms ? '' : 'opacity-70 !cursor-not-allowed'} cursor-pointer`}
            type="submit"
            disabled={loading}
          >
            {!loading ? 'Đăng ký' : (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              </div>
            )}
          </Button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"></div>
            <div className="relative flex justify-center text-sm items-center">
              <div className="flex-grow border-t border-gray-600"></div>
              <span className="px-2">Đăng nhập bằng</span>
              <div className="flex-grow border-t border-gray-600"></div>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              color="default"
              className="w-full rounded-lg h-12 shadow-md cursor-pointer bg-orange-400"
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              Google
            </Button>

            <Button
              color="primary"
              className="w-full rounded-lg h-12 shadow-md cursor-pointer"
              type="submit"
              disabled={!agreeToTerms}
            >
              <Facebook size={20} />
              Facebook
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
