import { useRouter } from 'next/router';
import { getSession, GetSessionParams } from 'next-auth/react';

import Login from '../components/screen/auth/login';
import Error from '../components/screen/auth/error';

import { prisma } from '../server/db/client';

const LoginPage = () => {
  const router = useRouter();
  const { error } = router.query;

  return error ? <Error type={error as string} /> : <Login />;
};

LoginPage.layout = 'Auth';

export async function getServerSideProps(context: GetSessionParams | undefined) {
  const session = await getSession(context);
  const email = session?.user?.email;
  if (email) {
    const user = await prisma.user.findFirst({ where: { email } });
    if (user?.emailVerified) {
      if (!user.stripeCustomerId) {
        return {
          redirect: {
            destination: '/connect-payment',
            permanent: false,
          },
        };
      }

      // check database if user has already password
      // return {
      //   redirect: {
      //     destination: '/auth/enter-password',
      //     permanent: false,
      //   },
      // };

      return {
        redirect: {
          destination: '/auth/create-password',
          permanent: false,
        },
      };
    }
  }
  return { props: {} };
}

export default LoginPage;
