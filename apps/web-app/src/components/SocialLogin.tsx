import { signIn } from 'next-auth/react';
import { useTheme } from 'next-themes';
import classNames from 'classnames';

import Button from './Button';

import GoogleIcon from '../assets/icon/google-logo.svg';
import GoogleWhiteIcon from '../assets/icon/google-white-logo.svg';
import AppleIcon from '../assets/icon/apple-logo.svg';
import GithubIcon from '../assets/icon/github-logo.svg';
import GithubWhiteIcon from '../assets/icon/github-white-logo.svg';

const SocialLogin = () => {
  const count = Object.values(process.env.providers as any).filter((v) => v).length;
  const { resolvedTheme: theme } = useTheme();
  const socialLogin = (type: string) => {
    signIn(type);
  };

  return (
    <>
      <div
        className={classNames(
          'grid grid gap-3',
          count === 3 ? 'grid-cols-3' : count === 2 ? 'grid-cols-2' : 'grid-cols-1'
        )}
      >
        {(process.env.providers as any).google && (
          <Button
            text=""
            icon={theme === 'light' ? GoogleIcon : GoogleWhiteIcon}
            onClick={() => socialLogin('google')}
            full
          />
        )}
        {(process.env.providers as any).apple && (
          <Button text="" icon={AppleIcon} onClick={() => socialLogin('apple')} full />
        )}
        {(process.env.providers as any).github && (
          <Button
            text=""
            icon={theme === 'light' ? GithubIcon : GithubWhiteIcon}
            onClick={() => socialLogin('github')}
            full
          />
        )}
      </div>
      {!!Object.values(process.env.providers as any).filter((v) => v).length && (
        <div className="relative flex py-5 items-center sm:mt-8">
          <div className='flex-grow border-t border-gray-200 dark:border-gray-200-dark'/>
          <span className="flex-shrink mx-4 text-gray-400 dark:text-gray-400">OR</span>
          <div className='flex-grow border-t border-gray-200 dark:border-gray-200-dark'/>
        </div>
      )}
    </>
  );
};

export default SocialLogin;
