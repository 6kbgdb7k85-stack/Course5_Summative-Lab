import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test } from "vitest";
import AdminPortal from "../components/AdminPortal";

describe("AdminPortal", () => {
  beforeEach(() => {
    render(<AdminPortal />);
  });
  test("renders properly", () => {
    expect(screen.getByText("Submit")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByLabelText("Category")).toBeInTheDocument();
    expect(screen.getByLabelText("Price")).toBeInTheDocument();
  });
  test("updates form properly", () => {
    const nameField = screen.getByLabelText("Name");
    const descriptionField = screen.getByLabelText("Description");
    const categoryField = screen.getByLabelText("Category");
    const priceField = screen.getByLabelText("Price");
    fireEvent.change(nameField, { target: { value: "testName" } });
    fireEvent.change(descriptionField, { target: { value: "testDescription" } });
    fireEvent.change(categoryField, { target: { value: "testCategory" } });
    fireEvent.change(priceField, { target: { value: "123" } });
    expect(nameField.value).toBe("testName");
    expect(descriptionField.value).toBe("testDescription");
    expect(categoryField.value).toBe("testCategory");
    expect(priceField.value).toBe("123");
  });
});
