import { useFilter } from "./FilterContext";
import { useEffect, useState, useMemo } from "react";
import { Tally3 } from 'lucide-react';
import axios from 'axios';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  images: string[];
  rating: number;
  category: string;
}

const MainContent = () => {
  const {
    searchQuery,
    selectedCategory,
    minPrice,
    maxPrice,
    keyword,
  } = useFilter();

  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(24);

  useEffect(() => {
    let url = `https://dummyjson.com/products?limit=${itemsPerPage}&skip=${(currentPage - 1) * itemsPerPage}`;
    if (keyword) {
      url = `https://dummyjson.com/products/search?q=${keyword}`;
    }

    axios.get(url).then((response) => {
      setProducts(response.data.products);
      setTotalProducts(response.data.total);
    });

  }, [currentPage, keyword]);

  const getFilteredProducts = () => {
    let filteredProducts = products;
    if (selectedCategory) {
      filteredProducts = filteredProducts.filter((product) => product.category === selectedCategory);
    }
    if (minPrice) {
      filteredProducts = filteredProducts.filter((product) => product.price >= minPrice);
    }
    if (maxPrice) {
      filteredProducts = filteredProducts.filter((product) => product.price <= maxPrice);
    }
    if (searchQuery) {
      filteredProducts = filteredProducts.filter((product) => product.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    switch (filter) {
      case "cheap":
        return filteredProducts.sort((a, b) => a.price - b.price);
      case "expensive":
        return filteredProducts.sort((a, b) => b.price - a.price);
      case "popular":
        return filteredProducts.sort((a, b) => b.rating - a.rating);
      default:
        return filteredProducts;
    }
  };

  const filteredProducts = useMemo(() => getFilteredProducts(), [products, selectedCategory, minPrice, maxPrice, searchQuery, filter]);

  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  const handlePageChange = (page:any) => {
    setCurrentPage(page);
  };

  return (
    <section className="xl:w-[105rem] lg:w-[70rem] sm:w-[40rem] xs:w-[20rem] p-5 ml-64">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <div className="relative mb-5 mt-5">
          <button
            className="border px-4 py-2 rounded-full flex items-center"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <Tally3 className="mr-2" />
            {filter === "all" ? "Filter" : filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
          {dropdownOpen && (
            <div className="absolute bg-white border-gray-300 rounded mt-2 w-full sm:w-40">
              <button onClick={() => {
                setFilter('cheap');
                setDropdownOpen(false);
              }} className="block px-4 py-3 w-full text-left hover:bg-gray-200">Cheap</button>
              <button onClick={() => {
                setFilter('expensive');
                setDropdownOpen(false);
              }} className="block px-4 py-3 w-full text-left hover:bg-gray-200">Expensive</button>
              <button onClick={() => {
                setFilter('popular');
                setDropdownOpen(false);
              }} className="block px-4 py-3 w-full text-left hover:bg-gray-200">Popular</button>
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white border rounded p-4">
            <img src={product.images[0]} alt={product.title} className="w-full h-48 object-cover mb-4" />
            <h2 className="text-lg font-bold">{product.title}</h2>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-lg font-bold">${product.price}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center mt-5">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
        <div>Page {currentPage} of {totalPages}</div>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default MainContent;
