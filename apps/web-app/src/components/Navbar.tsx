import Link from 'next/link';
import { useRouter } from 'next/router';
import ThemeSelectButton from './ThemeSelectButton';
import classNames from 'classnames';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { signOut } from 'next-auth/react';

const Navbar = () => {
  const router = useRouter();
  const { resolvedTheme: theme } = useTheme();
  const isWaitlist = process.env.waitlist && process.env.waitlist !== 'false';
  let auth = 'Join';
  if (['/join', '/waitlist'].includes(router.pathname)) auth = 'Log in';

  const handleAuth = () => {
    router.push(auth === 'Join' ? (isWaitlist ? '/waitlist' : '/join') : '/login');
  };

  return (
    <nav className={classNames('pt-10 px-10 flex justify-between relative h-20', theme)}>
      <Link href={'/'}>
        <div className="flex cursor-pointer sm:hidden block">
          <Image src="/logo.svg" width={32} height={32} alt="logo" />
        </div>
      </Link>
      <div className="flex ml-auto sm:ml-0 my-auto">
        <Link href={'https://find.world'}>
          <div className="mr-4 cursor-pointer dark:text-gray-100">Learn more</div>
        </Link>
        <Link href={'https://find.world/docs'}>
          <div className="mr-4 cursor-pointer dark:text-gray-100">Help</div>
        </Link>
      </div>
      <Link href={'/'}>
        <div className="flex cursor-pointer sm:flex hidden absolute left-1/2 translate-x-[-50%]">
          <Image
            src={theme === 'light' ? '/find-logo.svg' : '/find-logo-white.svg'}
            width={96}
            height={40}
            alt="logo"
          />
        </div>
      </Link>
      <div className="flex">
        <div className="text-sm text-gray-500 dark:text-gray-500-dark my-auto mr-4 sm:block hidden">
          {auth === 'Join' ? "Don't have an account?" : 'Already have an account?'}
        </div>
        <button
          onClick={handleAuth}
          className="bg-gray-100 dark:bg-gray-100-dark hover:bg-gray-400 text-gray-700 dark:text-gray-700-dark text-sm font-semibold py-1 px-4 rounded"
        >
          {auth}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
