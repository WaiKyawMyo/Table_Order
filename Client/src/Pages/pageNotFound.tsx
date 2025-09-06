import { useNavigate } from "react-router"

function PageNotFound() {
  const navigate = useNavigate()

  const goHome = () => {
    navigate('/')
  }

  const goToMenu = () => {
    navigate('/home/main')
  }

  const goBack = () => {
    navigate(-1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg text-center">
        {/* Restaurant Header */}
        <div className="mx-auto w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11h6" />
          </svg>
        </div>

        {/* 404 Animation */}
        <div className="mb-8">
          <div className="text-8xl font-bold text-orange-500 mb-4 animate-bounce">
            404
          </div>
          <div className="text-6xl mb-4">🍽️</div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Oops! Dish Not Found
          </h1>
          <p className="text-gray-600 text-lg mb-2">
            Looks like this menu item isn't available or you took a wrong turn in our restaurant!
          </p>
          <p className="text-gray-500 text-sm">
            Don't worry, our kitchen has plenty of other delicious options! 👨‍🍳
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={goToMenu}
            className="w-full py-4 px-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-lg rounded-2xl shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>View Menu</span>
          </button>

          <div className="flex gap-3">
            <button
              onClick={goHome}
              className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Start Over</span>
            </button>

            <button
              onClick={goBack}
              className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Go Back</span>
            </button>
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-8 p-4 bg-orange-50 rounded-2xl border border-orange-100">
          <p className="text-sm text-orange-800 mb-3 font-medium">
            <span className="mr-2">💡</span>
            <strong>Need assistance?</strong>
          </p>
          <ul className="text-sm text-orange-700 space-y-1 text-left">
            <li>• Browse our full menu for tasty options</li>
            <li>• Check your table code if you're having issues</li>
            <li>• Call a waiter if you need help</li>
            <li>• Ask about today's special dishes</li>
          </ul>
        </div>

        {/* Restaurant Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-2">
            🏠 Table Code Issues? Ask your server for help!
          </p>
          <div className="text-xs text-gray-400">
            Current URL: {window.location.pathname}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PageNotFound