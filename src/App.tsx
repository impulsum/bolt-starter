function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          VISA Data Tokens Template
        </h1>
        <p className="text-gray-600 mb-6">
          A simple starter template with Vite, React, TypeScript, and TailwindCSS
        </p>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span className="text-sm text-gray-700">Vite + React</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span className="text-sm text-gray-700">TypeScript</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span className="text-sm text-gray-700">TailwindCSS</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
