import '../DarkModeToggle.scss'

interface DarkModeToggleProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ darkMode, setDarkMode }) => {
  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      style={{
        padding: "5px 10px",
        borderRadius: "5px",
        border: "none",
        cursor: "pointer",
        backgroundColor: darkMode ? "#444" : "#ddd",
        color: darkMode ? "#fff" : "#000",
      }}
    >
      {darkMode ? "Light Mode" : "Dark Mode"}
    </button>
  );
};

export default DarkModeToggle;

