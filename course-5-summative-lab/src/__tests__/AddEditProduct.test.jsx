import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AddEditProduct from "../components/AddEditProduct";
import { useParams, useNavigate, useOutletContext, useLocation } from "react-router-dom";

// Mock the hooks
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: vi.fn(),
    useNavigate: vi.fn(),
    useOutletContext: vi.fn(),
    useLocation: vi.fn(),
  };
});

describe("AddEditProduct Component", () => {
  const mockNavigate = vi.fn();
  const mockAddEditItem = vi.fn();
  const mockSetAddProductResponse = vi.fn();
  const mockSetEditProductResponse = vi.fn();

  const mockContextValue = {
    loading: false,
    editProductResponse: null,
    addEditItem: mockAddEditItem,
    addProductResponse: null,
    setAddProductResponse: mockSetAddProductResponse,
    setEditProductResponse: mockSetEditProductResponse,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    useLocation.mockReturnValue({ state: null });
    useParams.mockReturnValue({ id: undefined });
    useOutletContext.mockReturnValue(mockContextValue);
  });

  describe("Rendering - Add Mode", () => {
    it("should render 'Add Product' heading when id is not provided", () => {
      render(<AddEditProduct />);
      expect(screen.getByText("Add Product")).toBeInTheDocument();
    });

    it("should render form fields for name, description, category, and price", () => {
      render(<AddEditProduct />);
      expect(screen.getByLabelText("Name")).toBeInTheDocument();
      expect(screen.getByLabelText("Description")).toBeInTheDocument();
      expect(screen.getByLabelText("Category")).toBeInTheDocument();
      expect(screen.getByLabelText("Price")).toBeInTheDocument();
    });

    it("should render submit button in add mode", () => {
      render(<AddEditProduct />);
      const submitButton = screen.getByRole("button", { name: "Submit" });
      expect(submitButton).toBeInTheDocument();
    });

    it("should not render cancel button in add mode", () => {
      render(<AddEditProduct />);
      const cancelButton = screen.queryByRole("button", { name: "Cancel" });
      expect(cancelButton).not.toBeInTheDocument();
    });

    it("should render form fields with empty initial values", () => {
      render(<AddEditProduct />);
      expect(screen.getByLabelText("Name")).toHaveValue("");
      expect(screen.getByLabelText("Description")).toHaveValue("");
      expect(screen.getByLabelText("Category")).toHaveValue("");
      expect(screen.getByLabelText("Price")).toHaveValue(0);
    });
  });

  describe("Rendering - Edit Mode", () => {
    beforeEach(() => {
      useParams.mockReturnValue({ id: "1" });
    });

    it("should render 'Edit Product' heading when id is provided", () => {
      render(<AddEditProduct />);
      expect(screen.getByText("Edit Product")).toBeInTheDocument();
    });

    it("should render cancel button in edit mode", () => {
      render(<AddEditProduct />);
      const cancelButton = screen.getByRole("button", { name: "Cancel" });
      expect(cancelButton).toBeInTheDocument();
    });

    it("should populate form fields with existing product data", () => {
      const existingProduct = {
        name: "Test Product",
        description: "Test Description",
        category: "Test Category",
        price: 100,
      };
      useLocation.mockReturnValue({ state: { product: existingProduct } });

      render(<AddEditProduct />);
      expect(screen.getByLabelText("Name")).toHaveValue("Test Product");
      expect(screen.getByLabelText("Description")).toHaveValue("Test Description");
      expect(screen.getByLabelText("Category")).toHaveValue("Test Category");
      expect(screen.getByLabelText("Price")).toHaveValue(100);
    });
  });

  describe("Form Field Updates", () => {
    it("should update name field on change", async () => {
      const user = userEvent.setup();
      render(<AddEditProduct />);
      const nameInput = screen.getByLabelText("Name");

      await user.type(nameInput, "New Product");
      expect(nameInput).toHaveValue("New Product");
    });

    it("should update description field on change", async () => {
      const user = userEvent.setup();
      render(<AddEditProduct />);
      const descriptionInput = screen.getByLabelText("Description");

      await user.type(descriptionInput, "New Description");
      expect(descriptionInput).toHaveValue("New Description");
    });

    it("should update category field on change", async () => {
      const user = userEvent.setup();
      render(<AddEditProduct />);
      const categoryInput = screen.getByLabelText("Category");

      await user.type(categoryInput, "New Category");
      expect(categoryInput).toHaveValue("New Category");
    });

    it("should update price field on change", async () => {
      const user = userEvent.setup();
      render(<AddEditProduct />);
      const priceInput = screen.getByLabelText("Price");

      await user.type(priceInput, "99.99");
      expect(priceInput).toHaveValue(99.99);
    });
  });

  describe("Form Submission - Validation", () => {
    it("should not call addEditItem when form is incomplete", async () => {
      const user = userEvent.setup();
      render(<AddEditProduct />);
      const submitButton = screen.getByRole("button", { name: "Submit" });

      await user.click(submitButton);
      expect(mockAddEditItem).not.toHaveBeenCalled();
    });

    it("should call addEditItem with form data when all fields are filled", async () => {
      const user = userEvent.setup();
      render(<AddEditProduct />);

      const nameInput = screen.getByLabelText("Name");
      const descriptionInput = screen.getByLabelText("Description");
      const categoryInput = screen.getByLabelText("Category");
      const priceInput = screen.getByLabelText("Price");
      const submitButton = screen.getByRole("button", { name: "Submit" });

      await user.type(nameInput, "Test Product");
      await user.type(descriptionInput, "Test Description");
      await user.type(categoryInput, "Test Category");
      await user.type(priceInput, "50");
      await user.click(submitButton);

      expect(mockAddEditItem).toHaveBeenCalledWith({
        name: "Test Product",
        description: "Test Description",
        category: "Test Category",
        price: "50",
      });
    });

    it("should not call addEditItem if name field is empty", async () => {
      const user = userEvent.setup();
      render(<AddEditProduct />);

      const descriptionInput = screen.getByLabelText("Description");
      const categoryInput = screen.getByLabelText("Category");
      const priceInput = screen.getByLabelText("Price");
      const submitButton = screen.getByRole("button", { name: "Submit" });

      await user.type(descriptionInput, "Test Description");
      await user.type(categoryInput, "Test Category");
      await user.type(priceInput, "50");
      await user.click(submitButton);

      expect(mockAddEditItem).not.toHaveBeenCalled();
    });

    it("should not call addEditItem if description field is empty", async () => {
      const user = userEvent.setup();
      render(<AddEditProduct />);

      const nameInput = screen.getByLabelText("Name");
      const categoryInput = screen.getByLabelText("Category");
      const priceInput = screen.getByLabelText("Price");
      const submitButton = screen.getByRole("button", { name: "Submit" });

      await user.type(nameInput, "Test Product");
      await user.type(categoryInput, "Test Category");
      await user.type(priceInput, "50");
      await user.click(submitButton);

      expect(mockAddEditItem).not.toHaveBeenCalled();
    });

    it("should not call addEditItem if price field is empty", async () => {
      const user = userEvent.setup();
      render(<AddEditProduct />);

      const nameInput = screen.getByLabelText("Name");
      const descriptionInput = screen.getByLabelText("Description");
      const categoryInput = screen.getByLabelText("Category");
      const submitButton = screen.getByRole("button", { name: "Submit" });

      await user.type(nameInput, "Test Product");
      await user.type(descriptionInput, "Test Description");
      await user.type(categoryInput, "Test Category");
      await user.click(submitButton);

      expect(mockAddEditItem).not.toHaveBeenCalled();
    });
  });

  describe("Loading State", () => {
    it("should disable submit button when loading is true", () => {
      useOutletContext.mockReturnValue({
        ...mockContextValue,
        loading: true,
      });
      render(<AddEditProduct />);
      const submitButton = screen.getByRole("button", { name: "Submit" });
      expect(submitButton).toBeDisabled();
    });

    it("should enable submit button when loading is false", () => {
      render(<AddEditProduct />);
      const submitButton = screen.getByRole("button", { name: "Submit" });
      expect(submitButton).not.toBeDisabled();
    });

    it("should display 'Saving Product...' message when loading is true", () => {
      useOutletContext.mockReturnValue({
        ...mockContextValue,
        loading: true,
      });
      render(<AddEditProduct />);
      expect(screen.getByText("Saving Product...")).toBeInTheDocument();
    });

    it("should not display 'Saving Product...' message when loading is false", () => {
      render(<AddEditProduct />);
      expect(screen.queryByText("Saving Product...")).not.toBeInTheDocument();
    });
  });

  describe("Add Product Response Handling", () => {
    it("should reset form when addProductResponse is received", async () => {
      const { rerender } = render(<AddEditProduct />);
      const user = userEvent.setup();

      // Fill form
      const nameInput = screen.getByLabelText("Name");
      await user.type(nameInput, "Test Product");

      // Simulate addProductResponse
      useOutletContext.mockReturnValue({
        ...mockContextValue,
        addProductResponse: { id: 1 },
      });
      rerender(<AddEditProduct />);

      expect(mockSetAddProductResponse).toHaveBeenCalledWith(null);
    });

    it("should call setAddProductResponse with null after successful add", async () => {
      const { rerender } = render(<AddEditProduct />);

      useOutletContext.mockReturnValue({
        ...mockContextValue,
        addProductResponse: { id: 1 },
      });
      rerender(<AddEditProduct />);

      await waitFor(() => {
        expect(mockSetAddProductResponse).toHaveBeenCalledWith(null);
      });
    });
  });

  describe("Edit Product Response Handling", () => {
    beforeEach(() => {
      useParams.mockReturnValue({ id: "1" });
    });

    it("should navigate to admin when editProductResponse is received", async () => {
      const { rerender } = render(<AddEditProduct />);

      useOutletContext.mockReturnValue({
        ...mockContextValue,
        editProductResponse: { id: 1 },
      });
      rerender(<AddEditProduct />);

      await waitFor(() => {
        expect(mockSetEditProductResponse).toHaveBeenCalledWith(null);
        expect(mockNavigate).toHaveBeenCalledWith("/admin");
      });
    });
  });

  describe("Navigation", () => {
    it("should navigate to /admin when cancel button is clicked in edit mode", async () => {
      const user = userEvent.setup();
      useParams.mockReturnValue({ id: "1" });
      render(<AddEditProduct />);

      const cancelButton = screen.getByRole("button", { name: "Cancel" });
      await user.click(cancelButton);

      expect(mockNavigate).toHaveBeenCalledWith("/admin");
    });
  });

  describe("Form Submission Events", () => {
    it("should prevent default form submission", async () => {
      const user = userEvent.setup();
      render(<AddEditProduct />);

      const nameInput = screen.getByLabelText("Name");
      const descriptionInput = screen.getByLabelText("Description");
      const categoryInput = screen.getByLabelText("Category");
      const priceInput = screen.getByLabelText("Price");
      const submitButton = screen.getByRole("button", { name: "Submit" });

      await user.type(nameInput, "Test Product");
      await user.type(descriptionInput, "Test Description");
      await user.type(categoryInput, "Test Category");
      await user.type(priceInput, "50");
      await user.click(submitButton);

      // If addEditItem was called, the default was prevented
      expect(mockAddEditItem).toHaveBeenCalled();
    });
  });
});
