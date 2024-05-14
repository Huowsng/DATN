import React, { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { DataProvider } from "./GlobalState";
import Header from "./components/Header/Header";
import Footer from "./components/footer/Footer";
import MainPages from "./components/mainpages/Pages";
import { TopHeader } from "./components/top-header/TopHeader";

function App() {
  const [showFooter, setShowFooter] = useState(true);
  const hideFooter = () => {
    setShowFooter(false);
  };
  return (
    <BrowserRouter>
      <DataProvider>
        <TopHeader />
        <Header />
        <MainPages />
        {showFooter && <Footer />}
      </DataProvider>
    </BrowserRouter>
  );
}

export default App;
