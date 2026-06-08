import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Legal from "./pages/Legal";


function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/loja" component={Shop} />
      <Route path="/colecao-pix" component={Collection} />
      <Route path="/colecoes" component={Shop} />
      <Route path="/camisetas" component={Shop} />
      <Route path="/croppeds" component={Shop} />
      <Route path="/bodies" component={Shop} />
      <Route path="/sobre" component={About} />
      <Route path="/contato" component={Contact} />
      <Route path="/faq" component={FAQ} />
      <Route path="/politica-privacidade" component={Legal} />
      <Route path="/politica-trocas" component={Legal} />
      <Route path="/prazo-envio" component={Legal} />
      <Route path="/termos" component={Legal} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
