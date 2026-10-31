import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Esets Crash Shield caught an error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleResetState = () => {
    try {
      localStorage.removeItem("esets_properties_cache");
      localStorage.setItem("esets_cache_version", "v6_clean_reset");
    } catch (e) {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-slate-800 rounded-3xl p-6 border border-slate-700 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center text-3xl">
              🛡️
            </div>
            <h2 className="text-xl font-bold text-emerald-400">
              Esets Crash Shield Active
            </h2>
            <p className="text-sm text-slate-300">
              ऐप में एक अप्रत्याशित समस्या आई थी, लेकिन आपके डेटा को सुरक्षित बचा लिया गया है।
            </p>
            <div className="pt-2 flex flex-col gap-2.5">
              <button
                onClick={this.handleReload}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition shadow-lg shadow-emerald-900/40"
              >
                🔄 ऐप रीफ्रेश करें (Refresh App)
              </button>
              <button
                onClick={this.handleResetState}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium text-xs transition"
              >
                कैश रीसेट करके दोबारा लोड करें
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
