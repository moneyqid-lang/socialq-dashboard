export default function LoginPage() {
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
            Welcome back
          </h1>
          <p className="text-gray-500 mt-1">
            Sign in to manage your social media automation
          </p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <button className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition-colors font-medium">
              Sign In
            </button>
            <p className="text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <a href="/register" className="text-teal-600 hover:underline">
                Sign up
              </a>
            </p>
          </div>
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800">
              <strong>Demo Mode:</strong> Clerk authentication not configured.
              Configure Clerk in <code>.env.local</code> to enable real authentication.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
