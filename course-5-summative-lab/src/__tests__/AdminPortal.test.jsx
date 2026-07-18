import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import AdminPortal from "../components/AdminPortal";

const mockAddItem = vi.fn();
let mockAddItemLoading = false;

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useOutletContext: () => ({
      addItem: mockAddItem,
      addItemLoading: mockAddItemLoading,
    }),
    Outlet: () => null,
  };
});

describe("AdminPortal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAddItemLoading = false;
  });

  afterEach(() => {
    cleanup();
  });

  test("renders properly", () => {
    render(<AdminPortal />);
    expect(screen.getByText("Add Product")).toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByLabelText("Category")).toBeInTheDocument();
    expect(screen.getByLabelText("Price")).toBeInTheDocument();
  });

  test("updates form properly", () => {
    render(<AdminPortal />);
    const nameField = screen.getByLabelText("Name");
    const descriptionField = screen.getByLabelText("Description");
    const categoryField = screen.getByLabelText("Category");
    const priceField = screen.getByLabelText("Price");
    fireEvent.change(nameField, { target: { value: "testName" } });
    fireEvent.change(descriptionField, {
      target: { value: "testDescription" },
    });
    fireEvent.change(categoryField, { target: { value: "testCategory" } });
    fireEvent.change(priceField, { target: { value: "123" } });
    expect(nameField.value).toBe("testName");
    expect(descriptionField.value).toBe("testDescription");
    expect(categoryField.value).toBe("testCategory");
    expect(priceField.value).toBe("123");
  });

  test("calls addItem with form data on valid submission", async () => {
    render(<AdminPortal />);
    const nameField = screen.getByLabelText("Name");
    const descriptionField = screen.getByLabelText("Description");
    const categoryField = screen.getByLabelText("Category");
    const priceField = screen.getByLabelText("Price");
    const submitButton = screen.getByRole("button", { name: "Submit" });

    await userEvent.type(nameField, "Laptop");
    await userEvent.type(descriptionField, "High-performance laptop");
    await userEvent.type(categoryField, "Electronics");
    await userEvent.type(priceField, "999");
    await userEvent.click(submitButton);

    expect(mockAddItem).toHaveBeenCalledWith({
      name: "Laptop",
      description: "High-performance laptop",
      category: "Electronics",
      price: "999",
    });
  });

  test("does not call addItem with empty name field", async () => {
    render(<AdminPortal />);
    const descriptionField = screen.getByLabelText("Description");
    const categoryField = screen.getByLabelText("Category");
    const priceField = screen.getByLabelText("Price");
    const submitButton = screen.getByRole("button", { name: "Submit" });

    await userEvent.type(descriptionField, "Test Description");
    await userEvent.type(categoryField, "Test Category");
    await userEvent.type(priceField, "100");
    await userEvent.click(submitButton);

    expect(mockAddItem).not.toHaveBeenCalled();
  });

  test("does not call addItem with empty description field", async () => {
    render(<AdminPortal />);
    const nameField = screen.getByLabelText("Name");
    const categoryField = screen.getByLabelText("Category");
    const priceField = screen.getByLabelText("Price");
    const submitButton = screen.getByRole("button", { name: "Submit" });

    await userEvent.type(nameField, "Laptop");
    await userEvent.type(categoryField, "Electronics");
    await userEvent.type(priceField, "999");
    await userEvent.click(submitButton);

    expect(mockAddItem).not.toHaveBeenCalled();
  });

  test("does not call addItem with empty category field", async () => {
    render(<AdminPortal />);
    const nameField = screen.getByLabelText("Name");
    const descriptionField = screen.getByLabelText("Description");
    const priceField = screen.getByLabelText("Price");
    const submitButton = screen.getByRole("button", { name: "Submit" });

    await userEvent.type(nameField, "Laptop");
    await userEvent.type(descriptionField, "High-performance laptop");
    await userEvent.type(priceField, "999");
    await userEvent.click(submitButton);

    expect(mockAddItem).not.toHaveBeenCalled();
  });

  test("does not call addItem with empty price field", async () => {
    render(<AdminPortal />);
    const nameField = screen.getByLabelText("Name");
    const descriptionField = screen.getByLabelText("Description");
    const categoryField = screen.getByLabelText("Category");
    const submitButton = screen.getByRole("button", { name: "Submit" });

    await userEvent.type(nameField, "Laptop");
    await userEvent.type(descriptionField, "High-performance laptop");
    await userEvent.type(categoryField, "Electronics");
    await userEvent.click(submitButton);

    expect(mockAddItem).not.toHaveBeenCalled();
  });

  test("disables submit button when loading", () => {
    mockAddItemLoading = true;
    render(<AdminPortal />);
    const submitButton = screen.getByRole("button", { name: "Submit" });
    expect(submitButton).toBeDisabled();
  });

  test("displays loading message when adding product", () => {
    mockAddItemLoading = true;
    render(<AdminPortal />);
    expect(screen.getByText("Adding Product...")).toBeInTheDocument();
  });

  test("does not display loading message when not loading", () => {
    render(<AdminPortal />);
    expect(screen.queryByText("Adding Product...")).not.toBeInTheDocument();
  });
});
