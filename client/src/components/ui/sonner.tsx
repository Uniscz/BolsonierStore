import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      position="bottom-right"
      duration={5000}
      closeButton
      richColors={false}
      toastOptions={{
        style: {
          background: "#0a0a0a",
          border: "2px solid #FF006E",
          color: "#ffffff",
          borderRadius: "0",
          padding: "1rem 1.25rem",
          minWidth: "320px",
          maxWidth: "420px",
          fontFamily: "'Inter', sans-serif",
          boxShadow: "0 8px 32px rgba(255, 0, 110, 0.25), 0 2px 8px rgba(0,0,0,0.8)",
        },
        classNames: {
          title: "text-sm font-black uppercase tracking-wider text-white",
          description: "text-xs text-gray-400 mt-0.5",
          actionButton:
            "!bg-pink-shock !text-white !text-xs !font-black !uppercase !tracking-wider !px-4 !py-2 !border-0 !cursor-pointer hover:!bg-white hover:!text-black !transition-colors !rounded-none",
          closeButton:
            "!text-gray-500 hover:!text-white !transition-colors",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
