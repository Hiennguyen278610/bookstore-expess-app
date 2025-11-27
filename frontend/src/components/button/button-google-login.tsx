import { useGoogleLogin } from '@react-oauth/google';
import { Button } from '../ui/button';
import { loginGoogle, useUser } from '@/services/authservices';
import { setJWTtoCookie } from '@/lib/cookies';
import { toast } from 'react-toastify';
import { GoogleIcon } from '@/components/svg/google';

export const ButtonLoginGoogle = () => {
  const { mutate } = useUser();
  const googleLogin = useGoogleLogin({
    onSuccess: async ({ code }) => {
      const response = await loginGoogle(code);
      await setJWTtoCookie(response.data.token);
      await mutate();
      toast.success('Đăng nhập thành công');
    },
    flow: 'auth-code'
  });
  return (
    <Button variant="outline" className="w-full mb-4" onClick={googleLogin}>
      <GoogleIcon />
      Đăng nhập với Google
    </Button>
  );
};
