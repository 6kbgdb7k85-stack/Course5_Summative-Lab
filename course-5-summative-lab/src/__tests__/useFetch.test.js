import { renderHook, waitFor } from "@testing-library/react";
import useFetch from "../common/utils/useFetch";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

describe("useFetch", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Initial state", () => {
    test("should initialize with loading false and response null", () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: "test" }),
      });

      const { result } = renderHook(() => useFetch("/api/test", "GET", false));

      expect(result.current.loading).toBe(false);
      expect(result.current.response).toBe(null);
    });

    test("should have runFetch and setResponse functions", () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: "test" }),
      });

      const { result } = renderHook(() => useFetch("/api/test", "GET", false));

      expect(typeof result.current.runFetch).toBe("function");
      expect(typeof result.current.setResponse).toBe("function");
    });
  });

  describe("Automatic fetch on load", () => {
    test("should fetch data on mount when onLoad is true", async () => {
      const mockData = { id: 1, name: "Product" };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const { result } = renderHook(() => useFetch("/api/products"));

      await waitFor(() => {
        expect(result.current.response).toEqual(mockData);
      });

      expect(global.fetch).toHaveBeenCalledWith("/api/products", null);
    });

    test("should not fetch data on mount when onLoad is false", async () => {
      const { result } = renderHook(() =>
        useFetch("/api/products", "GET", false)
      );

      expect(global.fetch).not.toHaveBeenCalled();
      expect(result.current.response).toBe(null);
    });

    test("should set loading to true while fetching", async () => {
      global.fetch.mockImplementationOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: async () => ({ data: "test" }),
                }),
              100
            )
          )
      );

      const { result } = renderHook(() => useFetch("/api/test"));

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe("GET requests", () => {
    test("should compile fetch options for GET with null", () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: "test" }),
      });

      renderHook(() => useFetch("/api/test", "GET", false));

      const { result } = renderHook(() => useFetch("/api/test", "GET", true));

      expect(global.fetch).toHaveBeenCalledWith("/api/test", null);
    });
  });

  describe("POST requests", () => {
    test("should send POST request with body", async () => {
      const mockData = { id: 1 };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const { result } = renderHook(() =>
        useFetch("/api/products", "POST", false)
      );

      const body = { name: "New Product", price: 19.99 };
      result.current.runFetch(body);

      await waitFor(() => {
        expect(result.current.response).toEqual(mockData);
      });

      expect(global.fetch).toHaveBeenCalledWith("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    });

    test("should handle POST response correctly", async () => {
      const mockData = { id: 1, name: "New Product", price: 19.99 };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const { result } = renderHook(() =>
        useFetch("/api/products", "POST", false)
      );

      result.current.runFetch({ name: "New Product", price: 19.99 });

      await waitFor(() => {
        expect(result.current.response).toEqual(mockData);
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe("PATCH requests", () => {
    test("should send PATCH request with body", async () => {
      const mockData = { id: 1, name: "Updated Product" };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const { result } = renderHook(() =>
        useFetch("/api/products/1", "PATCH", false)
      );

      const body = { name: "Updated Product" };
      result.current.runFetch(body);

      await waitFor(() => {
        expect(result.current.response).toEqual(mockData);
      });

      expect(global.fetch).toHaveBeenCalledWith("/api/products/1", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    });
  });

  describe("DELETE requests", () => {
    test("should send DELETE request without body", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => null,
      });

      const { result } = renderHook(() =>
        useFetch("/api/products/1", "DELETE", false)
      );

      result.current.runFetch();

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith("/api/products/1", {
          method: "DELETE",
        });
      });
    });
  });

  describe("Error handling", () => {
    test("should handle fetch errors gracefully", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation();
      const error = new Error("Network error");

      global.fetch.mockRejectedValueOnce(error);

      const { result } = renderHook(() => useFetch("/api/test"));

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(error);
      });

      consoleErrorSpy.mockRestore();
    });

    test("should handle non-ok responses", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({}),
      });

      const { result } = renderHook(() => useFetch("/api/notfound"));

      await waitFor(() => {
        expect(result.current.response).toBe(null);
      });
    });

    test("should handle invalid method with warning", async () => {
      const consoleWarnSpy = vi
        .spyOn(console, "warn")
        .mockImplementation();

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: "test" }),
      });

      const { result } = renderHook(() =>
        useFetch("/api/test", "INVALID", false)
      );

      result.current.runFetch();

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "Invalid config: attempting fetch with default params"
      );

      consoleWarnSpy.mockRestore();
    });
  });

  describe("Manual fetch execution", () => {
    test("should allow manual runFetch calls", async () => {
      const mockData = { id: 1 };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const { result } = renderHook(() =>
        useFetch("/api/products", "GET", false)
      );

      expect(global.fetch).not.toHaveBeenCalled();

      result.current.runFetch();

      await waitFor(() => {
        expect(result.current.response).toEqual(mockData);
      });

      expect(global.fetch).toHaveBeenCalled();
    });

    test("should update response when runFetch is called multiple times", async () => {
      const mockData1 = { id: 1 };
      const mockData2 = { id: 2 };

      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockData1,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockData2,
        });

      const { result, rerender } = renderHook(() =>
        useFetch("/api/products", "GET", false)
      );

      result.current.runFetch();

      await waitFor(() => {
        expect(result.current.response).toEqual(mockData1);
      });

      result.current.runFetch();

      await waitFor(() => {
        expect(result.current.response).toEqual(mockData2);
      });
    });
  });

  describe("setResponse function", () => {
    test("should update response using setResponse", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: "test" }),
      });

      const { result } = renderHook(() =>
        useFetch("/api/test", "GET", false)
      );

      const newData = { id: 1, name: "Test" };
      result.current.setResponse(newData);

      await waitFor(() => {
        expect(result.current.response).toEqual(newData);
      });
    });

    test("should allow clearing response with setResponse", async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: "test" }),
      });

      const { result } = renderHook(() =>
        useFetch("/api/test", "GET", false)
      );

      result.current.setResponse({ data: "test" });
      
      await waitFor(() => {
        expect(result.current.response).toEqual({ data: "test" });
      });

      result.current.setResponse(null);
      
      await waitFor(() => {
        expect(result.current.response).toBe(null);
      });
    });
  });

  describe("Default parameters", () => {
    test("should use GET as default method", async () => {
      const mockData = { data: "test" };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      renderHook(() => useFetch("/api/test"));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith("/api/test", null);
      });
    });

    test("should use true as default for onLoad", async () => {
      const mockData = { data: "test" };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      renderHook(() => useFetch("/api/test", "GET"));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });
    });
  });
});
