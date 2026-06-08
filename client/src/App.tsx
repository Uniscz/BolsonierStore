import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Collection from "./pages/Collection";
import BastilhaCollection from "./pages/BastilhaCollection";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import CamisetaPix from "./pages/CamisetaPix";


function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/loja" component={Shop} />
      <Route path="/produto/:id" component={ProductDetail} />
      <Route path="/colecao-pix" component={Collection} />
      <Route path="/colecao-bastilha" component={BastilhaCollection} />
      <Route path="/colecoes" component={Shop} />
      <Route path="/camisetas" component={Shop} />
      <Route path="/croppeds" component={Shop} />
      <Route path="/bodies" component={Shop} />
      <Route path="/sobre" component={About} />
      <Route path="/contato" component={Contact} />
      <Route path="/faq" component={FAQ} />
      <Route path="/camiseta-pix" component={CamisetaPix} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <CartProvider>
        <ThemeProvider
          defaultTheme="light"
          // switchable
        >
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </CartProvider>
    </ErrorBoundary>
  );
}

export default App;
