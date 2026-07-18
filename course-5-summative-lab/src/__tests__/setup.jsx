import "@testing-library/jest-dom/vitest";
import { cleanup, render } from "@testing-library/react";
import fetch from "node-fetch";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { afterEach, vi } from "vitest";

global.mockRouter = (element) => {
  const router = createMemoryRouter(
    [
      { path: "/", element: element ?? <div /> },
      { path: "/shop", element: element ?? <div /> },
      { path: "admin", element: element ?? <div /> },
      { path: "/testStart", element: element ?? <div /> },
    ],
    {
      initialEntries: ["/testStart"],
    },
  );

  render(<RouterProvider router={router}>
    {element}
  </RouterProvider>);

  return { router };
};

global.fetch = fetch;

global.setFetchResponse = (val) => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(val),
      ok: true,
      status: 200,
    }),
  );
};

afterEach(() => {
  vi.resetAllMocks();
  cleanup();
});
