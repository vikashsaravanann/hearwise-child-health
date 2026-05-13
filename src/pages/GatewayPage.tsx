import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function GatewayPage() {
  const routes = [
    { path: "/", name: "Landing Page" },
    { path: "/setup", name: "Session Setup" },
    { path: "/student-entry", name: "Student Entry" },
    { path: "/headphone-check", name: "Headphone Check" },
    { path: "/ocean-levels", name: "Ocean Level Select" },
    { path: "/ocean-test/1", name: "Ocean Test (Level 1)" },
    { path: "/level-result/1", name: "Level Result (Level 1)" },
    { path: "/session-summary", name: "Session Summary" },
    { path: "/dashboard", name: "Animated Dashboard" },
    { path: "/games", name: "Games" },
    { path: "/trophies", name: "Trophies" },
    { path: "/ear-care", name: "Ear Care" },
    { path: "/education", name: "Education" },
    { path: "/learn", name: "Learn" },
    { path: "/sound-explorer", name: "Sound Explorer" },
    { path: "/my-report", name: "My Report" },
    { path: "/headphone-safety", name: "Headphone Safety" },
    { path: "/noise-awareness", name: "Noise Awareness" },
    { path: "/self-check", name: "Self Check" },
    { path: "/book-appointment", name: "Book Appointment" },
    { path: "/leaderboard", name: "Leaderboard" },
    { path: "/help", name: "Help" },
    { path: "/about", name: "About" },
  ];

  return (
    <div className="min-h-screen bg-[#000b1d] text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black mb-2 text-cyan-400">HearWise Gateway</h1>
        <p className="text-white/60 mb-8">Access all application pages for development and testing.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {routes.map((route) => (
            <Link key={route.path} to={route.path}>
              <Button 
                variant="outline" 
                className="w-full h-16 justify-start text-left bg-white/5 border-white/10 hover:bg-cyan-500/20 hover:text-cyan-300 hover:border-cyan-500/30 transition-all font-semibold"
              >
                {route.name}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
