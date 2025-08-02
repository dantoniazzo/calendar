import { useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format, parse } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { ThemeToggle } from "../components/ThemeToggle";
import { useTheme } from "../hooks/useTheme";
import { useViewer } from "entities/viewer";

export function EditorPage() {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { viewer } = useViewer();
  const editorRef = useRef<HTMLIFrameElement>(null);
  const { isDark } = useTheme();
  const parsedDate = params.id
    ? parse(params.id, "yyyy-MM-dd", new Date())
    : new Date();
  const formattedDate = format(parsedDate, "MMMM d, yyyy");

  const handleBack = () => {
    navigate("/");
  };

  const handleIframeLoad = () => {
    if (editorRef.current) {
      editorRef.current.contentWindow?.postMessage(
        {
          type: "SET_THEME",
          theme: isDark ? "dark" : "light",
        },
        "*"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="h-screen flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Calendar
          </button>
          <div className="flex items-center justify-between sm:justify-end gap-4">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              {formattedDate}
            </h1>
            <ThemeToggle />
          </div>
        </div>

        <div className="flex-1">
          <iframe
            ref={editorRef}
            src={`https://simple-editor-gamma.vercel.app/${params.id}-${viewer?.id}`}
            className="w-full h-full border-0"
            title="Editor"
            onLoad={handleIframeLoad}
          />
        </div>
      </div>
    </div>
  );
}
