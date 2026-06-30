
const API_BASE_URL = "http://localhost:8080/api";

export const getProducts = async (category?: string) => {
  let url = `${API_BASE_URL}/products?page=0&size=100`;

  if (category) {
    url += `&category=${category}`;
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
};