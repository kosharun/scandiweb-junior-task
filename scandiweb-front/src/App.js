import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import CategoriesPage from './pages/CategoriesPage';
import ProductPage from './pages/ProductPage';
import Layout from './components/Layout';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: 'clothes',
      productId: '',
      isQuickShopOpen: false,
    };
  }

  setCategory = (category) => {
    this.setState({ category });
  }

  setProduct = (productId) => {
    this.setState({ productId });
  }

  updateQuickShopState = () => {
    this.setState({ isQuickShopOpen: true });
  }

  closeQuickShop = () => {
    this.setState({ isQuickShopOpen: false });
  }

  render() {
    return (
      <Router>
        <Layout>
          <Navbar setCategory={this.setCategory} />
          <Routes>
            {/* NAVIGATORS */}
            <Route path="/" element={<Navigate to="/categories/clothes" />} />
            <Route path="/categories" element={<Navigate to="/categories/clothes" />} />

            {/* PAGES */}
            <Route path="/categories/:id" element={<CategoriesPage setProduct={this.setProduct} category={this.state.category} updateQuickShopState={this.updateQuickShopState} />} />
            <Route path="/product" element={<ProductPage productId={this.state.productId} closeQuickShop={this.closeQuickShop} isQuickShopOpen={this.state.isQuickShopOpen} />} />
          </Routes>
        </Layout>
      </Router>
    );
  }
}

export default App;
