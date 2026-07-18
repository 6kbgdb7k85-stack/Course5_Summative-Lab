import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import Shop from "../components/Shop";
import * as useFetchModule from "../common/utils/useFetch";

const mockProducts = [
  { id: 1, name: "Laptop", price: 999 },
  { id: 2, name: "Mouse", price: 29 },
  { id: 3, name: "Keyboard", price: 79 },
  { id: 4, name: "Monitor", price: 299 },
];

describe("Shop", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders Shop heading", () => {
    vi.spyOn(useFetchModule, "default").mockReturnValue({
      loading: false,
      response: [],
    });
    global.mockRouter(<Shop />)
    expect(screen.getByText("Shop")).toBeInTheDocument();
  });

  test("displays loading state", () => {
    vi.spyOn(useFetchModule, "default").mockReturnValue({
      loading: true,
      response: null,
    });
    global.mockRouter(<Shop />)
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("renders products when data is loaded", () => {
    vi.spyOn(useFetchModule, "default").mockReturnValue({
      loading: false,
      response: mockProducts,
    });
    global.mockRouter(<Shop />)
    expect(screen.getByText("Laptop")).toBeInTheDocument();
    expect(screen.getByText("Mouse")).toBeInTheDocument();
    expect(screen.getByText("Keyboard")).toBeInTheDocument();
    expect(screen.getByText("Monitor")).toBeInTheDocument();
  });

  test("renders search input field", () => {
    vi.spyOn(useFetchModule, "default").mockReturnValue({
      loading: false,
      response: mockProducts,
    });
    global.mockRouter(<Shop />)
    const searchInput = screen.getByPlaceholderText(
      "Search by product name..."
    );
    expect(searchInput).toBeInTheDocument();
  });

  test("filters products by search query", async () => {
    vi.spyOn(useFetchModule, "default").mockReturnValue({
      loading: false,
      response: mockProducts,
    });
    global.mockRouter(<Shop />)
    const searchInput = screen.getByPlaceholderText(
      "Search by product name..."
    );

    await userEvent.type(searchInput, "Laptop");

    expect(screen.getByText("Laptop")).toBeInTheDocument();
    expect(screen.queryByText("Mouse")).not.toBeInTheDocument();
    expect(screen.queryByText("Keyboard")).not.toBeInTheDocument();
  });

  test("filters products case-insensitively", async () => {
    vi.spyOn(useFetchModule, "default").mockReturnValue({
      loading: false,
      response: mockProducts,
    });
    global.mockRouter(<Shop />)
    const searchInput = screen.getByPlaceholderText(
      "Search by product name..."
    );

    await userEvent.type(searchInput, "laptop");

    expect(screen.getByText("Laptop")).toBeInTheDocument();
  });

  test("shows no products when search returns no results", async () => {
    vi.spyOn(useFetchModule, "default").mockReturnValue({
      loading: false,
      response: mockProducts,
    });
    global.mockRouter(<Shop />)
    const searchInput = screen.getByPlaceholderText(
      "Search by product name..."
    );

    await userEvent.type(searchInput, "Nonexistent");

    expect(screen.queryByText("Laptop")).not.toBeInTheDocument();
    expect(screen.queryByText("Mouse")).not.toBeInTheDocument();
  });

  test("clears filter and shows all products when search is cleared", async () => {
    vi.spyOn(useFetchModule, "default").mockReturnValue({
      loading: false,
      response: mockProducts,
    });
    global.mockRouter(<Shop />)
    const searchInput = screen.getByPlaceholderText(
      "Search by product name..."
    );

    await userEvent.type(searchInput, "Laptop");
    expect(screen.queryByText("Mouse")).not.toBeInTheDocument();

    await userEvent.clear(searchInput);
    expect(screen.getByText("Laptop")).toBeInTheDocument();
    expect(screen.getByText("Mouse")).toBeInTheDocument();
  });

  test("renders empty list when no products are available", () => {
    vi.spyOn(useFetchModule, "default").mockReturnValue({
      loading: false,
      response: [],
    });
    global.mockRouter(<Shop />)
    expect(screen.getByText("Shop")).toBeInTheDocument();
    expect(screen.queryByText("Laptop")).not.toBeInTheDocument();
  });
});