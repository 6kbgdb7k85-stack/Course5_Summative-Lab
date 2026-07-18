import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test } from "vitest";
import Shop from "../components/Shop";

describe('Shop',()=>{
    beforeEach(()=>{
        render(<Shop/>)
    })
    test('renders properly',()=>{
        expect(screen.getByText('Shop')).toBeInTheDocument();
    })
})