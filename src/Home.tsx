import { useState } from "react";
import { Plus, Clock, Sun, Moon, Menu } from "lucide-react";
import { TimerList } from "./components/TimerList/TimerList";
import { TimerModal } from "./components/TimerModal/TimerModal";
import { Button } from "./components/Button";
import { Toaster } from "sonner";
import { useTimerStore } from "./store/useTimerStore";

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTimerStore();

  return (
    <div
      className={`min-h-screen ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-800 to-gray-900 text-white"
          : "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900"
      }`}
    >
      <Toaster position="top-right" />
      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Main Header Container */}
        <nav className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
          {/* Logo Section */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Clock
                className={`w-6 h-6 sm:w-8 sm:h-8 ${
                  theme === "dark" ? "text-blue-400" : "text-blue-600"
                }`}
              />
              <h1 className="text-xl sm:text-2xl font-bold">Timer App</h1>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="p-2 sm:hidden rounded-lg hover:bg-opacity-10 hover:bg-gray-500"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Actions Section */}
          <div
            className={`${
              isMenuOpen ? "flex" : "hidden"
            } sm:flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 py-2 sm:py-0`}
          >
            {/* Theme Toggle Button */}
            <Button
              onClick={toggleTheme}
              size="lg"
              className={`flex justify-center items-center space-x-2 p-2 rounded-lg w-full sm:w-auto ${
                theme === "dark"
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {theme === "dark" ? (
                <>
                  <Sun className="w-5 h-5 text-yellow-400" />
                  <span className="sm:hidden">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-5 h-5 text-gray-600" />
                  <span className="sm:hidden text-black">Dark Mode</span>
                </>
              )}
            </Button>

            {/* Add Timer Button */}
            <Button
              onClick={() => setIsModalOpen(true)}
              size="lg"
              className={`flex justify-center items-center space-x-2 shadow-md hover:shadow-lg w-full sm:w-auto ${
                theme === "dark"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              <Plus className="w-5 h-5" />
              <span>Add Timer</span>
            </Button>
          </div>
        </nav>

        {/* Timer List Section */}
        <div className="mt-6 sm:mt-8">
          <TimerList />
        </div>

        <TimerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
}

export default Home;
