import NextAuth, { type NextAuthOptions } from 'next-auth';
import { createTransport } from 'nodemailer';
import * as aws from '@aws-sdk/client-ses';

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '../../../server/db/client';

// Providers
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import EmailProvider from 'next-auth/providers/email';

function html(params: { url: string; host: string }) {
  const { url, host } = params;

  const escapedHost = host.replace(/\./g, '&#8203;.');

  const brandColor = '#346df1';
  const color = {
    background: '#f9f9f9',
    text: '#444',
    mainBackground: '#fff',
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText: '#fff',
  };

  return `
<body style="background: ${color.background};">
  <table width="100%" border="0" cellspacing="20" cellpadding="0"
    style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center"
        style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Sign in to <strong>${escapedHost}</strong>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}"><a href="${url}"
                target="_blank"
                style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;">Sign
                in</a></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        If you did not request this email you can safely ignore it.
      </td>
    </tr>
  </table>
</body>
`;
}

function text({ url, host }: { url: string; host: string }) {
  return `Sign in to ${host}\n${url}\n\n`;
}

let providers = [];
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  providers.push(
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    })
  );
}

if (
  process.env.FIND_SES_AWS_REGION &&
  process.env.FIND_SES_AWS_ACCESS_KEY_ID &&
  process.env.FIND_SES_AWS_SECRET_ACCESS_KEY
) {
  const ses = new aws.SES({
    region: process.env.FIND_SES_AWS_REGION,
    credentials: {
      accessKeyId: process.env.FIND_SES_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.FIND_SES_AWS_SECRET_ACCESS_KEY,
    },
  });

  const transport = createTransport({
    SES: { ses, aws },
  });

  providers.push(
    EmailProvider({
      async sendVerificationRequest(params) {
        const { identifier, url } = params;
        const { host } = new URL(url);
        const result = await transport.sendMail({
          to: identifier,
          from: process.env.EMAIL_FROM,
          subject: 'Welcome to Findlabs',
          text: text({ url, host }),
          html: html({ url, host }),
        });
        const failed = result.rejected?.concat(result.pending).filter(Boolean);
        if (failed && failed.length) {
          throw new Error(`Email(s) could not be sent`);
        }
      },
    })
  );
}

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session, token }) {
      if (token?.user) {
        session.user = {
          ...session.user,
          ...(token.user as object),
        };
      }
      return session;
    },
    jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        const image = user.image || profile?.avatar_url;
        token.user = {
          ...user,
          image,
        };
      }
      return token;
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers,
  pages: {
    verifyRequest: '/auth/verify',
    error: '/auth/error',
    signIn: '/login',
  },
};

export default NextAuth(authOptions);
