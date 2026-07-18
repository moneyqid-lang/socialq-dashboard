import { SignUp } from '@clerk/nextjs';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-teal-600">
              <span className="text-xl font-bold text-white">S</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">SocialQ</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">
            Create your account
          </h1>
          <p className="text-gray-500 mt-1">
            Start automating your social media content
          </p>
        </div>
        <SignUp
          appearance={{
            elements: {
              formButtonPrimary:
                'bg-teal-600 hover:bg-teal-700 text-white',
              card: 'shadow-lg border border-gray-200 rounded-xl',
            },
          }}
        />
      </div>
    </div>
  );
}
