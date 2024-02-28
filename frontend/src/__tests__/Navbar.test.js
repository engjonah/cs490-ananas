import React from 'react'
import { render, screen, cleanup, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from "../components/Navbar.js"
import { act } from 'react-dom/test-utils';

describe("Navbar component", () => {
    const RoutedNavbar = () => {
        return (
        <Router>
            <Navbar />
        </Router>
        )
    }
    afterEach(() => {
        cleanup()
    })
    it("logo renders tooltip when hovered over", async () => {
        render(<RoutedNavbar />)
        const triggerElement = screen.getByText("Ananas")
        userEvent.hover(triggerElement)
        await waitFor(() => {
            expect(screen.getByRole("tooltip", { hidden: true })).toBeVisible();
        });
    })
    it("links route to their respective pages", () => {
        render(<RoutedNavbar />)
        act(() => {
            const triggerElements = screen.getAllByRole("link")
            const pageNames = ["/", "/translate", "/documentation", "/account"]
            for (let i = 0; i < triggerElements.length; i++) {
                userEvent.click(triggerElements[i])
                expect(window.location.pathname).toBe(pageNames[i]); 
            }
        })
    })
    it("navbar maintains routing functionality across different screen sizes", () => {
        render(<RoutedNavbar />)
        act(() => {
            global.innerWidth = 320;
            global.innerHeight = 480;
            global.dispatchEvent(new Event('resize'));
            const triggerElements = screen.getAllByRole("link")
            const pageNames = ["/", "/translate", "/documentation", "/account"]
            for (let i = 0; i < triggerElements.length; i++) {
                userEvent.click(triggerElements[i])
                expect(window.location.pathname).toBe(pageNames[i]); 
            }
        })
    })
})
