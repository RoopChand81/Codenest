import { Link } from "react-router-dom"
//handle when go wrong route
export default function ErrorPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-richblack-800 to-richblack-900 px-4 text-center">
      
      {/* Anime GIF */}
      <img
        src="https://media.giphy.com/media/9Y5BbDSkSTiY8/giphy.gif"
        alt="404 Anime Girl"
        className="w-72 md:w-96 drop-shadow-xl mb-6 rounded-lg"
      />

      {/* Heading */}
      <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-yellow-400 to-purple-500 mb-4 animate-pulse">
        404 - Page Not Found
      </h1>

      {/* Subtext */}
      <p className="text-richblack-200 text-lg md:text-xl max-w-xl mb-8">
        Oh no! You’ve taken the wrong path, senpai 🥺<br />
        Let’s guide you back before things get weird.
      </p>

      {/* Glowing Button */}
      <Link
        to="/"
        className="relative group inline-block px-6 py-3 text-base font-semibold text-white transition duration-200 ease-in-out rounded-full bg-yellow-400 hover:bg-yellow-300 shadow-lg hover:shadow-yellow-500/50"
      >
        Take Me Home 🍙
        <span className="absolute inset-0 rounded-full bg-yellow-400 blur-md opacity-0 group-hover:opacity-50 transition-all duration-300 ease-in-out"></span>
      </Link>
    </div>
  )
}
