import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import App from "../App";

describe('App',()=>{
    test('Renders Home Page on load',()=>{
        render(<App/>)
        expect(screen.getByTestId('navbar')).toBeInTheDocument()
    })
})