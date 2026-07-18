import { cleanup, fireEvent, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import NavBar from "../common/components/NavBar";

describe("NavBar", () => {
  let router;

  beforeEach(() => {
    router = global.mockRouter(<NavBar />).router;
  });

  test("Home links to Home", () => {
    const homeButton = screen.getByText("Home");
    fireEvent.click(homeButton);
    expect(router.state.location.pathname).toBe("/");
  });

  test("Shop links to Shop", () => {
    const shopButton = screen.getByText("Shop");
    fireEvent.click(shopButton);
    expect(router.state.location.pathname).toBe("/shop");
  });

  test("Admin Portal links to Admin Portal", () => {
    const adminButton = screen.getByText("Admin Portal");
    fireEvent.click(adminButton);
    expect(router.state.location.pathname).toBe("/admin");
  });
});
