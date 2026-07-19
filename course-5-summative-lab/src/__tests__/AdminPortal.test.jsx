import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AdminPortal from "../components/AdminPortal";
import { useParams, Outlet } from "react-router-dom";
import * as useFetchModule from "../common/utils/useFetch";

// Mock the hooks
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: vi.fn(),
    Outlet: vi.fn(() => <div data-testid="outlet">Outlet</div>),
  };
});

vi.mock("../common/utils/useFetch");

describe("AdminPortal Component", () => {
  const mockAddProductFetch = {
    loading: false,
    response: null,
    runFetch: vi.fn(),
    setResponse: vi.fn(),
  };

  const mockEditProductFetch = {
    loading: false,
    response: null,
    runFetch: vi.fn(),
    setResponse: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useParams.mockReturnValue({ id: undefined });
    
    // Reset mock fetch objects
    mockAddProductFetch.loading = false;
    mockAddProductFetch.response = null;
    mockAddProductFetch.runFetch = vi.fn();
    mockAddProductFetch.setResponse = vi.fn();
    
    mockEditProductFetch.loading = false;
    mockEditProductFetch.response = null;
    mockEditProductFetch.runFetch = vi.fn();
    mockEditProductFetch.setResponse = vi.fn();
    
    vi.mocked(useFetchModule.default).mockImplementation((url) => {
      if (url === "http://localhost:6001/products") {
        return mockAddProductFetch;
      }
      return mockEditProductFetch;
    });
  });

  describe("Component Rendering", () => {
    it("should render the component without crashing", () => {
      render(<AdminPortal />);
      expect(screen.getByTestId("outlet")).toBeInTheDocument();
    });

    it("should render Outlet component", () => {
      render(<AdminPortal />);
      expect(Outlet).toHaveBeenCalled();
    });
  });

  describe("useFetch Hook Initialization", () => {
    it("should initialize POST fetch for adding products when id is not present", () => {
      render(<AdminPortal />);
      expect(vi.mocked(useFetchModule.default)).toHaveBeenCalledWith(
        "http://localhost:6001/products",
        "POST",
        false
      );
    });

    it("should initialize PATCH fetch for editing products when id is present", () => {
      useParams.mockReturnValue({ id: "1" });
      render(<AdminPortal />);
      expect(vi.mocked(useFetchModule.default)).toHaveBeenCalledWith(
        "http://localhost:6001/products/1",
        "PATCH",
        false
      );
    });

    it("should initialize PATCH fetch with different id when id changes", () => {
      const { rerender } = render(<AdminPortal />);
      useParams.mockReturnValue({ id: "2" });
      rerender(<AdminPortal />);

      expect(vi.mocked(useFetchModule.default)).toHaveBeenCalledWith(
        "http://localhost:6001/products/2",
        "PATCH",
        false
      );
    });
  });

  describe("Context Provided to Outlet", () => {
    it("should provide addProductResponse in context", () => {
      mockAddProductFetch.response = { id: 1, name: "Test Product" };
      render(<AdminPortal />);

      const contextArg = Outlet.mock.calls[0][0];
      expect(contextArg.context.addProductResponse).toEqual({
        id: 1,
        name: "Test Product",
      });
    });

    it("should provide editProductResponse in context", () => {
      mockEditProductFetch.response = { id: 1, name: "Updated Product" };
      render(<AdminPortal />);

      const contextArg = Outlet.mock.calls[0][0];
      expect(contextArg.context.editProductResponse).toEqual({
        id: 1,
        name: "Updated Product",
      });
    });

    it("should provide addEditItem function in context", () => {
      render(<AdminPortal />);

      const contextArg = Outlet.mock.calls[0][0];
      expect(contextArg.context.addEditItem).toBeDefined();
      expect(typeof contextArg.context.addEditItem).toBe("function");
    });

    it("should provide loading state in context", () => {
      mockAddProductFetch.loading = true;
      render(<AdminPortal />);

      const contextArg = Outlet.mock.calls[0][0];
      expect(contextArg.context.loading).toBe(true);
    });

    it("should provide setAddProductResponse in context", () => {
      render(<AdminPortal />);

      const contextArg = Outlet.mock.calls[0][0];
      expect(contextArg.context.setAddProductResponse).toBeDefined();
      expect(typeof contextArg.context.setAddProductResponse).toBe("function");
    });

    it("should provide setEditProductResponse in context", () => {
      render(<AdminPortal />);

      const contextArg = Outlet.mock.calls[0][0];
      expect(contextArg.context.setEditProductResponse).toBeDefined();
      expect(typeof contextArg.context.setEditProductResponse).toBe("function");
    });
  });

  describe("Loading State Management", () => {
    it("should combine loading states from add and edit fetches", () => {
      mockAddProductFetch.loading = true;
      mockEditProductFetch.loading = false;
      render(<AdminPortal />);

      const contextArg = Outlet.mock.calls[0][0];
      expect(contextArg.context.loading).toBe(true);
    });

    it("should be true when edit fetch is loading", () => {
      mockAddProductFetch.loading = false;
      mockEditProductFetch.loading = true;
      render(<AdminPortal />);

      const contextArg = Outlet.mock.calls[0][0];
      expect(contextArg.context.loading).toBe(true);
    });

    it("should be true when both fetches are loading", () => {
      mockAddProductFetch.loading = true;
      mockEditProductFetch.loading = true;
      render(<AdminPortal />);

      const contextArg = Outlet.mock.calls[0][0];
      expect(contextArg.context.loading).toBe(true);
    });

    it("should be false when neither fetch is loading", () => {
      mockAddProductFetch.loading = false;
      mockEditProductFetch.loading = false;
      render(<AdminPortal />);

      const contextArg = Outlet.mock.calls[0][0];
      expect(contextArg.context.loading).toBe(false);
    });
  });

  describe("addEditItem Function", () => {
    it("should call runAddProduct when id is not provided", () => {
      useParams.mockReturnValue({ id: undefined });
      render(<AdminPortal />);

      const contextArg = Outlet.mock.calls[0][0];
      const testItem = { name: "New Product", price: 100 };
      contextArg.context.addEditItem(testItem);

      expect(mockAddProductFetch.runFetch).toHaveBeenCalledWith(testItem);
    });

    it("should call runEditProduct when id is provided", () => {
      useParams.mockReturnValue({ id: "1" });
      render(<AdminPortal />);

      const contextArg = Outlet.mock.calls[0][0];
      const testItem = { name: "Updated Product", price: 150 };
      contextArg.context.addEditItem(testItem);

      expect(mockEditProductFetch.runFetch).toHaveBeenCalledWith(testItem);
    });

    it("should not call runEditProduct when adding a product", () => {
      useParams.mockReturnValue({ id: undefined });
      render(<AdminPortal />);

      const contextArg = Outlet.mock.calls[0][0];
      const testItem = { name: "New Product", price: 100 };
      contextArg.context.addEditItem(testItem);

      expect(mockEditProductFetch.runFetch).not.toHaveBeenCalled();
    });

    it("should not call runAddProduct when editing a product", () => {
      useParams.mockReturnValue({ id: "1" });
      render(<AdminPortal />);

      const contextArg = Outlet.mock.calls[0][0];
      const testItem = { name: "Updated Product", price: 150 };
      contextArg.context.addEditItem(testItem);

      expect(mockAddProductFetch.runFetch).not.toHaveBeenCalled();
    });

    it("should handle objects as items", () => {
      render(<AdminPortal />);

      const contextArg = Outlet.mock.calls[0][0];
      const complexItem = {
        name: "Complex Product",
        description: "A test product",
        category: "Test",
        price: 99.99,
      };
      contextArg.context.addEditItem(complexItem);

      expect(mockAddProductFetch.runFetch).toHaveBeenCalledWith(complexItem);
    });
  });

  describe("Response State Updates", () => {
    it("should update context when addProductResponse changes", () => {
      const { rerender } = render(<AdminPortal />);
      
      const initialContext = Outlet.mock.calls[0][0];
      expect(initialContext.context.addProductResponse).toBe(null);

      mockAddProductFetch.response = { id: 1, name: "New Product" };
      rerender(<AdminPortal />);

      const updatedContext = Outlet.mock.calls[1][0];
      expect(updatedContext.context.addProductResponse).toEqual({
        id: 1,
        name: "New Product",
      });
    });

    it("should update context when editProductResponse changes", () => {
      useParams.mockReturnValue({ id: "1" });
      const { rerender } = render(<AdminPortal />);

      mockEditProductFetch.response = { id: 1, name: "Updated Product" };
      rerender(<AdminPortal />);

      const updatedContext = Outlet.mock.calls[1][0];
      expect(updatedContext.context.editProductResponse).toEqual({
        id: 1,
        name: "Updated Product",
      });
    });

    it("should maintain null responses initially", () => {
      mockAddProductFetch.response = null;
      mockEditProductFetch.response = null;
      render(<AdminPortal />);

      const contextArg = Outlet.mock.calls[0][0];
      expect(contextArg.context.addProductResponse).toBeNull();
      expect(contextArg.context.editProductResponse).toBeNull();
    });
  });

  describe("Context Stability", () => {
    it("should provide stable context reference across renders", () => {
      const { rerender } = render(<AdminPortal />);
      
      const firstCallContext = Outlet.mock.calls[0][0].context;
      
      rerender(<AdminPortal />);
      
      const secondCallContext = Outlet.mock.calls[1][0].context;
      
      // Both should have the same properties
      expect(Object.keys(firstCallContext).sort()).toEqual(
        Object.keys(secondCallContext).sort()
      );
    });
  });

  describe("Edge Cases", () => {
    it("should handle undefined id parameter", () => {
      useParams.mockReturnValue({ id: undefined });
      render(<AdminPortal />);

      expect(vi.mocked(useFetchModule.default)).toHaveBeenCalledWith(
        "http://localhost:6001/products",
        "POST",
        false
      );
    });

    it("should handle null id parameter", () => {
      useParams.mockReturnValue({ id: null });
      const { rerender } = render(<AdminPortal />);

      // Should create PATCH URL with null
      expect(vi.mocked(useFetchModule.default)).toHaveBeenCalledWith(
        "http://localhost:6001/products/null",
        "PATCH",
        false
      );
    });

    it("should handle numeric string id", () => {
      useParams.mockReturnValue({ id: "123" });
      render(<AdminPortal />);

      expect(vi.mocked(useFetchModule.default)).toHaveBeenCalledWith(
        "http://localhost:6001/products/123",
        "PATCH",
        false
      );
    });

    it("should handle alphanumeric id", () => {
      useParams.mockReturnValue({ id: "prod-abc123" });
      render(<AdminPortal />);

      expect(vi.mocked(useFetchModule.default)).toHaveBeenCalledWith(
        "http://localhost:6001/products/prod-abc123",
        "PATCH",
        false
      );
    });
  });

  describe("Multiple Sequential Operations", () => {
    it("should correctly route multiple addEditItem calls", () => {
      useParams.mockReturnValue({ id: undefined });
      render(<AdminPortal />);

      const contextArg = Outlet.mock.calls[0][0];
      
      contextArg.context.addEditItem({ name: "Product 1" });
      contextArg.context.addEditItem({ name: "Product 2" });

      expect(mockAddProductFetch.runFetch).toHaveBeenCalledTimes(2);
      expect(mockAddProductFetch.runFetch).toHaveBeenNthCalledWith(
        1,
        { name: "Product 1" }
      );
      expect(mockAddProductFetch.runFetch).toHaveBeenNthCalledWith(
        2,
        { name: "Product 2" }
      );
    });

    it("should switch between add and edit operations", () => {
      const { rerender } = render(<AdminPortal />);
      useParams.mockReturnValue({ id: undefined });
      
      let contextArg = Outlet.mock.calls[0][0];
      contextArg.context.addEditItem({ name: "New Product" });
      expect(mockAddProductFetch.runFetch).toHaveBeenCalledTimes(1);

      useParams.mockReturnValue({ id: "1" });
      rerender(<AdminPortal />);
      
      contextArg = Outlet.mock.calls[1][0];
      contextArg.context.addEditItem({ name: "Updated Product" });
      expect(mockEditProductFetch.runFetch).toHaveBeenCalledTimes(1);
    });
  });
});
