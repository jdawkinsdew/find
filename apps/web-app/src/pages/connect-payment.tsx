import { useEffect } from 'react';
import Image from 'next/image';
import { getSession, GetSessionParams } from 'next-auth/react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../components/CheckoutForm';
import { trpc } from '../utils/trpc';
import LockIcon from '../assets/icon/lock.svg';
import TargetIcon from '../assets/icon/target.svg';
import NoNetworkIcon from '../assets/icon/no-network.svg';
import TuneIcon from '../assets/icon/tune.svg';
import UnlockIcon from '../assets/icon/unlock.svg';
import EncryptIcon from '../assets/icon/encrypt.svg';

const ConnectPayment = () => {
  const { mutate, isLoading, data } = trpc.useMutation('payment.plan');
  useEffect(() => {
    mutate({ name: 'start', amount: 5 });
  }, []);

  if (isLoading) return <></>;
  if (!process.env.stripeKey || !data?.id)
    return <div className="text-3xl mx-auto">Payment is not connected!</div>;

  const stripePromise = loadStripe(process.env.stripeKey || '');

  return (
    <div className="lg:max-w-4xl max-w-[500px] mx-auto w-full py-12">
      <h1 className="font-semibold text-4xl mb-0 lg:mt-0">Start your journey</h1>
      <div className="font-semibold text-4xl mb-3 text-blue-500">for $5 a month</div>
      <p className="text-gray-500 dark:text-gray-500-dark sm:text-base text-sm mb-12 max-w-lg mx-auto">
        Your Find subscription will renew automatically every month for $5. You can cancel your
        subscription any time.
      </p>
      <div className="grid lg:grid-cols-2 space gap-6 text-left text-gray-500 dark:text-gray-500-dark lg:px-0 sm:px-5 px-0">
        <div className="lg:block hidden">
          <h2 className="font-semibold text-lg mb-3">What you get</h2>
          <ul className="bg-gray-50 dark:bg-gray-50-dark p-5 pl-12 rounded-lg list-disc relative text-gray-500 dark:text-gray-500-dark">
            <li className="flex my-3">
              <div className="absolute left-4">
                <Image src={TargetIcon} alt="target" />
              </div>
              <div>
                A unique new search experience designed for speed, efficiency, accuracy, and
                exploration
              </div>
            </li>
            <li className="flex my-3">
              <div className="absolute left-4">
                <Image src={NoNetworkIcon} alt="network" />
              </div>
              <div>No ads, tracking or integrations with ad networks</div>
            </li>
            <li className="flex my-3">
              <div className="absolute left-4">
                <Image src={TuneIcon} alt="tune" />
              </div>
              <div>Customizable algorithms that find high quality and relevant information</div>
            </li>
            <li className="flex my-3">
              <div className="absolute left-4">
                <Image src={UnlockIcon} alt="unlock" />
              </div>
              <div>A transparent open-source community</div>
            </li>
            <li className="flex my-3">
              <div className="absolute left-4">
                <Image src={EncryptIcon} alt="encrypt" />
              </div>
              <div>End-to-end encryption of your private search data</div>
            </li>
          </ul>
        </div>
        <div>
          <Elements stripe={stripePromise}>
            <CheckoutForm plan={data.id} />
          </Elements>
          <div className="bg-gray-100 dark:bg-gray-100-dark text-gray-500 dark:text-gray-500-dark py-3 px-4 rounded-lg text-sm flex mt-3 px-3">
            <div className="w-6 h-6 mr-2">
              <Image src={LockIcon} alt="secret" />
            </div>
            <div>We use Stripe for payments and never see or save your card details ourselves.</div>
          </div>
        </div>
        <div className="lg:hidden block">
          <h2 className="font-semibold text-lg mb-3 text-gray-700 dark:text-gray-700-dark">
            What you get
          </h2>
          <ul className="bg-gray-50 dark:bg-gray-50-dark p-5 pl-12 rounded-lg list-disc relative text-gray-500 dark:text-gray-500-dark">
            <li className="flex my-3">
              <div className="absolute left-4">
                <Image src={TargetIcon} alt="target" />
              </div>
              <div>
                A unique new search experience designed for speed, efficiency, accuracy, and
                exploration
              </div>
            </li>
            <li className="flex my-3">
              <div className="absolute left-4">
                <Image src={NoNetworkIcon} alt="network" />
              </div>
              <div>No ads, tracking or integrations with ad networks</div>
            </li>
            <li className="flex my-3">
              <div className="absolute left-4">
                <Image src={TuneIcon} alt="tune" />
              </div>
              <div>Customizable algorithms that find high quality and relevant information</div>
            </li>
            <li className="flex my-3">
              <div className="absolute left-4">
                <Image src={UnlockIcon} alt="unlock" />
              </div>
              <div>A transparent open-source community</div>
            </li>
            <li className="flex my-3">
              <div className="absolute left-4">
                <Image src={EncryptIcon} alt="encrypt" />
              </div>
              <div>End-to-end encryption of your private search data</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

ConnectPayment.layout = 'Auth';

export async function getServerSideProps(context: GetSessionParams | undefined) {
  const session = await getSession(context);
  if (!session?.user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  return { props: {} };
}

export default ConnectPayment;
