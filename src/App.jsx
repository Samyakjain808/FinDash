import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/Dashboard";
import useStore from "./store/useStore";

export default function App() {
  const darkMode = useStore((s) => s.darkMode);

  return (
    <>
      <Dashboard />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "12px",
            padding:"12px 16px",
            fontSize:"14px",
            fontFamily:"'Inter', system-ui, sans-serif",
            ...(darkMode
              ? {
                  background: "#1e2433",
                  color: "#e2e8f0",
                  border: "1px solid #2a3348",
                  boxShadow: "0 4px 24px rgba(0, 0, 0, 0.4)",
                }
              : {
                  background:"#fff",
                  color:"#1e293b",
                  border:"1px solid #e2e8f0",
                  boxShadow:"0 4px 24px rgba(0, 0, 0, 0.08)",
                }),
          },
          success: {
            iconTheme: {
              primary:"#10b981",
              secondary:"#fff",
            },
          },
          error: {
            iconTheme: {
              primary:"#f43f5e",
              secondary:"#fff",
            },
          },
        }}
      />
    </>
  );
}
