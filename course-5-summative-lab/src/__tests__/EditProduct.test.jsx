import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import EditProduct from "../components/EditProduct";
import * as useFetchModule from "../common/utils/useFetch";

const mockProduct = {
  id: 1,
  name: "Laptop",
  description: "High-performance laptop",
  category: "Electronics",
  price: 999,
};

const mockNavigate = vi.fn();
const mockRunFetch = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ id: "1" }),
    useNavigate: () => mockNavigate,
    useLocation: () => ({
      state: { product: mockProduct },
    }),
  };
});

describe("EditProduct", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders Edit Product heading", () => {
    vi.spyOn(useFetchModule, "default").mockReturnValue({
      loading: false,
      response: null,
      runFetch: mockRunFetch,
    });
    render(<EditProduct />);
    expect(screen.getByText("Edit Product")).toBeInTheDocument();
  });

  test("renders form fields with product data", () => {
    vi.spyOn(useFetchModule, "default").mockReturnValue({
      loading: false,
      response: null,
      runFetch: mockRunFetch,
    });
    render(<EditProduct />);
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByLabelText("Category")).toBeInTheDocument();
    expect(screen.getByLabelText("Price")).toBeInTheDocument();
  });

  test("updates form state on input change", async () => {
    vi.spyOn(useFetchModule, "default").mockReturnValue({
      loading: false,
      response: null,
      runFetch: mockRunFetch,
    });
    render(<EditProduct />);
    const nameInput = screen.getByLabelText("Name");
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Updated Laptop");
    expect(nameInput.value).toBe("Updated Laptop");
  });

  test("submits form with valid data", async () => {
    vi.spyOn(useFetchModule, "default").mockReturnValue({
      loading: false,
      response: null,
      runFetch: mockRunFetch,
    });
    render(<EditProduct />);
    const submitButton = screen.getByRole("button", { name: "Submit" });
    await userEvent.click(submitButton);
    expect(mockRunFetch).toHaveBeenCalled();
  });

  test("does not submit form with empty fields", async () => {
    vi.spyOn(useFetchModule, "default").mockReturnValue({
      loading: false,
      response: null,
      runFetch: mockRunFetch,
    });
    render(<EditProduct />);
    const nameInput = screen.getByLabelText("Name");
    await userEvent.clear(nameInput);
    const submitButton = screen.getByRole("button", { name: "Submit" });
    await userEvent.click(submitButton);
    expect(mockRunFetch).not.toHaveBeenCalled();
  });

  test("disables submit button while loading", () => {
    vi.spyOn(useFetchModule, "default").mockReturnValue({
      loading: true,
      response: null,
      runFetch: mockRunFetch,
    });
    render(<EditProduct />);
    const submitButton = screen.getByRole("button", { name: "Submit" });
    expect(submitButton).toBeDisabled();
  });

  test("displays loading message while saving", () => {
    vi.spyOn(useFetchModule, "default").mockReturnValue({
      loading: true,
      response: null,
      runFetch: mockRunFetch,
    });
    render(<EditProduct />);
    expect(screen.getByText("Saving Product...")).toBeInTheDocument();
  });

  test("navigates to admin page on successful response", () => {
    vi.spyOn(useFetchModule, "default").mockReturnValue({
      loading: false,
      response: mockProduct,
      runFetch: mockRunFetch,
    });
    render(<EditProduct />);
    expect(mockNavigate).toHaveBeenCalledWith("/admin");
  });

  test("does not display loading message when not loading", () => {
    vi.spyOn(useFetchModule, "default").mockReturnValue({
      loading: false,
      response: null,
      runFetch: mockRunFetch,
    });
    render(<EditProduct />);
    expect(screen.queryByText("Saving Product...")).not.toBeInTheDocument();
  });
});