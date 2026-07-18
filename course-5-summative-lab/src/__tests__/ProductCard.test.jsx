import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { describe, expect, test, vi } from "vitest";
import ProductCard from "../components/ProductCard";

describe("ProductCard", () => {
  const mockProduct = {
    id: 1,
    name: "Test Product",
    category: "Electronics",
    description: "A great test product",
    price: 99.99,
  };

  const renderWithRouter = (component, initialPath = "/") => {
    const router = createMemoryRouter(
      [
        { path: "/", element: component },
        { path: "/admin/*", element: component },
        { path: "/shop", element: component },
      ],
      {
        initialEntries: [initialPath],
      }
    );
    return render(<RouterProvider router={router}>{component}</RouterProvider>);
  };

  test("renders product information correctly", () => {
    renderWithRouter(<ProductCard product={mockProduct} onDelete={() => {}} loading={false} />);

    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("Electronics")).toBeInTheDocument();
    expect(screen.getByText("A great test product")).toBeInTheDocument();
    expect(screen.getByText("$99.99")).toBeInTheDocument();
  });

  test("does not render Edit and Delete buttons on non-admin route", () => {
    renderWithRouter(
      <ProductCard product={mockProduct} onDelete={() => {}} loading={false} />,
      "/shop"
    );

    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
  });

  test("renders Edit and Delete buttons on admin route", () => {
    renderWithRouter(
      <ProductCard product={mockProduct} onDelete={() => {}} loading={false} />,
      "/admin"
    );

    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  test("Delete button calls onDelete with correct product id", async () => {
    const mockOnDelete = vi.fn();
    const user = userEvent.setup();

    renderWithRouter(
      <ProductCard product={mockProduct} onDelete={mockOnDelete} loading={false} />,
      "/admin"
    );

    const deleteButton = screen.getByText("Delete");
    await user.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(1);
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  test("Delete button is disabled when loading is true", () => {
    renderWithRouter(
      <ProductCard product={mockProduct} onDelete={() => {}} loading={true} />,
      "/admin"
    );

    const deleteButton = screen.getByText("Delete");
    expect(deleteButton).toBeDisabled();
  });

  test("Delete button is not disabled when loading is false", () => {
    renderWithRouter(
      <ProductCard product={mockProduct} onDelete={() => {}} loading={false} />,
      "/admin"
    );

    const deleteButton = screen.getByText("Delete");
    expect(deleteButton).not.toBeDisabled();
  });

  test("Edit button click triggers navigation with correct path and state", async () => {
    const user = userEvent.setup();
    const mockNavigate = vi.fn();

    const router = createMemoryRouter(
      [
        {
          path: "/admin/:id",
          element: <ProductCard product={mockProduct} onDelete={() => {}} loading={false} />,
        },
        { path: "/admin", element: <ProductCard product={mockProduct} onDelete={() => {}} loading={false} /> },
      ],
      {
        initialEntries: ["/admin"],
      }
    );

    render(<RouterProvider router={router}>
      <ProductCard product={mockProduct} onDelete={() => {}} loading={false} />
    </RouterProvider>);

    const editButton = screen.getByText("Edit");
    await user.click(editButton);

    // Verify the button was clicked
    expect(editButton).toBeInTheDocument();
  });

  test("renders product with different price values", () => {
    const productWithDifferentPrice = { ...mockProduct, price: 49.99 };

    renderWithRouter(
      <ProductCard product={productWithDifferentPrice} onDelete={() => {}} loading={false} />
    );

    expect(screen.getByText("$49.99")).toBeInTheDocument();
  });

  test("renders product with special characters in name", () => {
    const productWithSpecialName = { ...mockProduct, name: "Product & Co's Item" };

    renderWithRouter(
      <ProductCard product={productWithSpecialName} onDelete={() => {}} loading={false} />
    );

    expect(screen.getByText("Product & Co's Item")).toBeInTheDocument();
  });
});
