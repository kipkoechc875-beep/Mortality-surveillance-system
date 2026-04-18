import type { ComponentType } from "react";
import { Redirect, Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { RecordsProvider } from "@/context/RecordsContext";
import { AppLayout } from "@/components/layout/AppLayout";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import AddRecord from "@/pages/AddRecord";
import Records from "@/pages/Records";
import RecordDetail from "@/pages/RecordDetail";
import { PublicLayout } from "@/components/layout/PublicLayout";

type ProtectedRouteProps = {
  component: ComponentType;
};

function ProtectedRoute({ component: Component }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  return (
    <AppLayout>
      <Component />
    </AppLayout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/">{() => <PublicLayout><Home /></PublicLayout>}</Route>
      <Route path="/about">{() => <PublicLayout><About /></PublicLayout>}</Route>
      <Route path="/contact">{() => <PublicLayout><Contact /></PublicLayout>}</Route>
      <Route path="/register">{() => <PublicLayout><Register /></PublicLayout>}</Route>
      <Route path="/login">{() => <PublicLayout><Login /></PublicLayout>}</Route>
      <Route path="/dashboard">{() => <ProtectedRoute component={Dashboard} />}</Route>
      <Route path="/records/new">{() => <ProtectedRoute component={AddRecord} />}</Route>
      <Route path="/records/:id">{() => <ProtectedRoute component={RecordDetail} />}</Route>
      <Route path="/records">{() => <ProtectedRoute component={Records} />}</Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <AuthProvider>
      <RecordsProvider>
        <Router />
        <Toaster />
      </RecordsProvider>
    </AuthProvider>
  );
}

export default App;
