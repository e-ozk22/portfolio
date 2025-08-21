//カバレッジ
import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { Hello } from "../components/Hello"

describe("Hello component", () => {
  it("renders with name", () => {
    render(<Hello name="John" />)
    expect(screen.getByText("Hello, John!")).toBeInTheDocument()
  })
})
