import React from 'react'
import { render, screen, cleanup, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from "../../components/Navbar.js"
import { act } from 'react-dom/test-utils';
import { useAuthContext } from '../../hooks/useAuthContext.js';

jest.mock('../../hooks/useAuthContext', () => ({
    useAuthContext: jest.fn(),
}));

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
    it("logo renders tooltip when hovered over", () => {
        useAuthContext.mockReturnValue(true);
        render(<RoutedNavbar />)
        const triggerElement = screen.getByText("Ananas")
        userEvent.hover(triggerElement)
        waitFor(() => {
            expect(screen.getByRole("tooltip", { hidden: true })).toBeVisible();
        });
    })
    it("logout button renders when logged in", () => {
        useAuthContext.mockReturnValue(true)
        render(<RoutedNavbar />)
        waitFor(() => {
            const logoutButton = screen.getByText("LOGOUT")
            expect(logoutButton).toBeInDocument()
        })
    })
    it("links route to their respective pages", () => {
        useAuthContext.mockReturnValue(true);
        render(<RoutedNavbar />)
        act(() => {
            const triggerElements = screen.getAllByRole("link")
            const pageNames = ["/", "/translate", "/documentation", "/SignIn"]
            for (let i = 0; i < triggerElements.length; i++) {
                userEvent.click(triggerElements[i])
                expect(window.location.pathname).toBe(pageNames[i]);
            }
        })
    })
    it("navbar maintains routing functionality across different screen sizes", () => {
        useAuthContext.mockReturnValue(true);
        render(<RoutedNavbar />)
        act(() => {
            global.innerWidth = 320;
            global.innerHeight = 480;
            global.dispatchEvent(new Event('resize'));
            const triggerElements = screen.getAllByRole("link")
            const pageNames = ["/", "/translate", "/documentation", "/SignIn"]
            for (let i = 0; i < triggerElements.length; i++) {
                userEvent.click(triggerElements[i])
                expect(window.location.pathname).toBe(pageNames[i]);
            }
        })
    })
    it("translate link redirects to sign in page when logged out", () => {
        useAuthContext.mockReturnValue(false)
        render(<RoutedNavbar />)
        act(() => {
            const triggerElement = screen.getAllByRole("link")[1]
            userEvent.click(triggerElement)
            waitFor(() => {
                expect(window.location.pathname).toBe("/SignIn");
            });
        })
    })
})
