import { FormEvent, useEffect, useState } from 'react';
import Image from 'next/image';
import { getSession, GetSessionParams } from 'next-auth/react';
import { useRouter } from 'next/router';

import Button from '../../components/Button';
import Input from '../../components/radix/Input';
import PasswordChecker from '../../components/PasswordChecker';

import EyeIcon from '../../assets/icon/eye.svg';
import InfoIcon from '../../assets/icon/info.svg';

const CreatePassword = () => {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [type, setType] = useState('password');
  const [error, setError] = useState({
    password: '',
    confirm: '',
  });

  const handleType = () => setType(type === 'text' ? 'password' : 'text');
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!password || password !== confirmPassword) {
      setError({
        password: password ? '' : 'Password is required',
        confirm: password !== confirmPassword ? "Password doesn't match" : '',
      });
      return;
    }
  };

  return (
    <div className="max-w-[600px] mx-auto w-full py-12">
      <h1 className="font-semibold text-4xl mb-3 sm:mt-0">Create your Find master password</h1>
      <div className="max-w-[480px] mx-auto">
        <p className="text-gray-500 dark:text-gray-500-dark sm:text-base text-sm mb-12 mb-8">
          Your master password is the only way to access your Find account. It&apos;s used to
          end-to-end encrypt your private data. Use a strong password and keep it a secret.
        </p>
        <form onSubmit={handleSubmit}>
          <Input
            className="w-full text-left mb-3"
            label="Password"
            type={type}
            value={password}
            onChange={setPassword}
            placeholder="Enter your Password"
            icon={EyeIcon}
            onIconClick={handleType}
          />
          <PasswordChecker password={password} />
          <Input
            className="w-full text-left mb-8"
            label="Confirm Password"
            type={type}
            value={password}
            onChange={setConfirmPassword}
            placeholder="Enter your Password"
            icon={EyeIcon}
            onIconClick={handleType}
          />
          <Button
            type="submit"
            text="Submit"
            solid
            full
            primary
            className="mx-0"
            loading={false}
            disabled={!password}
          />
        </form>
        <div className="bg-gray-100 dark:bg-gray-100-dark text-gray-500 dark:text-gray-500-dark py-3 px-4 text-center rounded-lg text-sm flex mt-4">
          <div className="w-8 h-8 mr-3 ml-auto mt-1">
            <Image src={InfoIcon} alt="information" />
          </div>
          <div className="mr-auto text-left">
            Be sure to save your Master Password securely. If you forget your Master Password, you
            won&apos;t be able to login. Find uses end-to-end encryption, so we can&apos;t reset
            your Master Password.
          </div>
        </div>
      </div>
    </div>
  );
};

CreatePassword.layout = 'Auth';

export async function getServerSideProps(context: GetSessionParams | undefined) {
  const session = await getSession(context);
  if (!session?.user)
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };

  return { props: {} };
}

export default CreatePassword;
