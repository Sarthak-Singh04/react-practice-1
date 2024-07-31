import { useEffect, useState } from "react";
import { useFilter } from "./FilterContext";

interface Product {
  category: string;
}

interface FetchResponse {
  products: Product[];
}

const Sidebar = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    keyword,
    setKeyword,
  } = useFilter();

  const [categories, setCategories] = useState<string[]>([]);
  const [keywords] = useState<string[]>([
    "apple",
    "watch",
    "Fashion",
    "trend",
    "shoes",
    "shirt",
  ]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://dummyjson.com/products");
        const data: FetchResponse = await response.json();
        const fetchedCategories = Array.from(
          new Set(data.products.map((product) => product.category))
        );
        setCategories(fetchedCategories);
        console.log(fetchedCategories);
      } catch (error) {
        console.error("Error fetching products", error);
      }
    };

    fetchCategories();
  }, []);

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMinPrice(value ? parseFloat(value) : undefined);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMaxPrice(value ? parseFloat(value) : undefined);
  };

  const handleRadioChangeCategory = (category: string) => {
    setSelectedCategory(category);
  };

  const handleKeyword = (keyword: string) => {
    setKeyword(keyword);
  };

  const handleReset = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setKeyword("");
  };

  return (
    <div className="fixed top-0 left-0 h-screen overflow-y-auto w-64 p-5 bg-slate-400/5">
      <h1 className="text-2xl font-bold mb-6 mt-4">Store</h1>
      <section>
        <input
          type="text"
          className="border-2 rounded px-2 py-1 mb-4 w-full"
          placeholder="Search Product"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex justify-center items-center mb-4">
          <input
            type="text"
            className="border-2 mr-2 px-5 py-2 w-full rounded"
            placeholder="Min"
            value={minPrice ?? ""}
            onChange={handleMinPriceChange}
          />
          <input
            type="text"
            className="border-2 px-5 py-2 w-full rounded"
            placeholder="Max"
            value={maxPrice ?? ""}
            onChange={handleMaxPriceChange}
          />
        </div>
        <div className="mb-5">
          <h2 className="text-xl font-semibold mb-3">Categories</h2>
          <section>
            {categories.map((category, index) => (
              <label key={index} className="block mb-2">
                <input
                  type="radio"
                  name="category"
                  value={category}
                  onChange={() => handleRadioChangeCategory(category)}
                  className="mr-2 w-[16px] h-[16px] "
                  checked={selectedCategory === category}
                />
                {category.toUpperCase()}
              </label>
            ))}
          </section>
          <div className="mb-5 mt-4">
            <h2 className="text-xl font-semibold">Keywords</h2>
          </div>
          <div className="mb-4">
            {keywords.map((keyword, index) => (
              <button
                key={index}
                className="block mb-2 px-4 py-2 w-full text-left border rounded hover:bg-gray-200"
                onClick={() => handleKeyword(keyword)}
              >
                {keyword.toUpperCase()}
              </button>
            ))}
          </div>
          <button onClick={handleReset} className="w-full py-2 text-white bg-slate-600 rounded hover:bg-slate-500 mt-4">
            Reset Filters
          </button>
        </div>
      </section>
    </div>
  );
};

export default Sidebar;