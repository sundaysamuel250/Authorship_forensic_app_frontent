import { useState } from "react";
import { getAuth } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import axios from "axios";
import Plot from "react-plotly.js";
import { db } from "./firebase";

interface AnalysisResult {
  author: "AI" | "Human";
  confidence: number;
  stylometry?: {
    featureNames: string[];
    values: number[];
  };
  heatmap?: {
    matrix: number[][];
    labels: string[];
  };
}

const Upload = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in to analyze.");
      return;
    }

    if (!text && !file) {
      setError("Please upload a file or enter text.");
      return;
    }

    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      if (file) {
        formData.append("file", file);
      } else {
        formData.append("text", text);
      }

      const response = await axios.post("http://127.0.0.1:8000/api/analyze/", formData);
      const analysis: AnalysisResult = response.data;

      setResult(analysis);

      await addDoc(collection(db, "analyses"), {
        userId: user.uid,
        timestamp: new Date(),
        inputType: file ? "file" : "text",
        result: analysis,
      });
    } catch (err) {
      console.error(err);
      setError(error);
    } finally {
      setUploading(false);
    }
  };

  const exportData = () => {
    if (result) {
      const blob = new Blob([JSON.stringify(result, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "analysis_result.json";
      link.click();
    }
  };

  return (
    <div className={`min-h-screen p-4 pt-24 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      <div className="max-w-4xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold font-sans text-center sm:text-left">AI vs Human Detection</h2>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-3 py-1 border rounded text-sm w-fit"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <form onSubmit={handleAnalyze} className="space-y-4">
          <label className="block w-full">
            <span className="font-semibold">Upload File (TXT or PDF)</span>
            <input
              type="file"
              accept=".pdf,.txt"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="mt-2 w-full border-b border-gray-400 bg-transparent focus:outline-none"
            />
          </label>

          <label className="block w-full">
            <span className="font-semibold">Or Paste Text Below</span>
            <textarea
              rows={6}
              placeholder="Paste text to detect authorship..."
              className="w-full p-2 border rounded mt-2 resize-none"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </label>

          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-[#ff66c4] text-white py-2 rounded hover:bg-[#ff664c] transition"
          >
            {uploading ? "Analyzing..." : "Analyze"}
          </button>
        </form>

        {result && (
          <div className="bg-gray-100 p-4 rounded dark:bg-gray-800">
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Analysis Results</h3>
            <p className="mb-2">
              <strong>Prediction:</strong>{" "}
              <span className={`font-bold ${result.author === "AI" ? "text-red-500" : "text-green-500"}`}>
                {result.author}
              </span>
            </p>
            <p className="mb-2">
              <strong>Confidence Score:</strong> {result.confidence}%
            </p>

            {result.stylometry && (
              <div className="mb-4 overflow-x-auto">
                <h4 className="font-semibold mb-1">Stylometric Features</h4>
                <Plot
                  data={[{
                    type: "bar",
                    x: result.stylometry.featureNames,
                    y: result.stylometry.values,
                    marker: { color: "steelblue" },
                  }]}
                  layout={{
                    title: "Stylometric Feature Distribution",
                    paper_bgcolor: darkMode ? "#1f2937" : "#fff",
                    font: { color: darkMode ? "#fff" : "#000" },
                    autosize: true,
                  }}
                  useResizeHandler
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            )}

            {result.heatmap && (
              <div className="mb-4 overflow-x-auto">
                <h4 className="font-semibold mb-1">Feature Similarity Heatmap</h4>
                <Plot
                  data={[{
                    z: result.heatmap.matrix,
                    x: result.heatmap.labels,
                    y: result.heatmap.labels,
                    type: "heatmap",
                    colorscale: "Viridis",
                  }]}
                  layout={{
                    title: "Heatmap",
                    paper_bgcolor: darkMode ? "#1f2937" : "#fff",
                    font: { color: darkMode ? "#fff" : "#000" },
                    autosize: true,
                  }}
                  useResizeHandler
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            )}

            <button
              onClick={exportData}
              className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            >
              Export Results
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;